'use strict';

const _ = require('lodash');
const BoxCLIError = require('./cli-error');
const os = require('os');
const path = require('path');
const fs = require('fs');
const { mkdirp } = require('mkdirp');

const REQUIRED_CONFIG_VALUES = Object.freeze([
	'boxAppSettings.clientID',
	'boxAppSettings.clientSecret',
	'boxAppSettings.appAuth.publicKeyID',
	'boxAppSettings.appAuth.passphrase',
	'enterpriseID',
]);

const REQUIRED_CONFIG_VALUES_CCG = Object.freeze([
	'boxAppSettings.clientID',
	'boxAppSettings.clientSecret',
	'enterpriseID',
]);

const NUMBER_REGEX = /^[-+]?\d*\.?\d+$/u;
const UNESCAPED_COMMA_REGEX = /(?<![^\\](?:\\\\)*\\),/gu;
const UNESCAPED_SUBSCRIPT_REGEX =
	/(?<![^\\](?:\\\\)*\\)\[(.*?)(?<![^\\](?:\\\\)*\\)\]/gu;

const PATH_ESCAPES = Object.freeze({
	'/': '~1',
	'~': '~0',
});

/**
 * Unescape a string that no longer needs to be escaped with slashes,
 * optionally replacing certain escaped characters with new
 * escape codes.
 *
 * @param {string} str The string to unescape
 * @param {Object} replacements A mapping of escaped characters to new escape codes
 * @returns {string} The unescaped string
 * @private
 */
function unescapeString(str, replacements = {}) {
	let ret = '',
		chars = [...str];

	while (chars.length > 0) {
		let char = chars.shift();
		if (char === '\\') {
			let nextChar = chars.shift();
			nextChar = replacements[nextChar] || nextChar;
			if (nextChar) {
				ret += nextChar;
			}
		} else {
			ret += char;
		}
	}

	return ret;
}

/**
 * Parse a metadata key into the correct format, including escaping
 * for JSON Patch operations.
 *
 * This method accepts two formats:
 * 1) /path/to\/from/key => /path/to~1from/key
 * 2) path[to][] => /path/to/-
 *
 * @param {string} value The value to parse as a metadata key
 * @returns {string} The parsed key
 * @private
 */
function parseKey(value) {
	if (value.startsWith('/')) {
		// Treat as path
		return unescapeString(value, PATH_ESCAPES);
	}
	// Treat as key
	let parts = value.split(UNESCAPED_SUBSCRIPT_REGEX);
	if (parts[parts.length - 1] === '') {
		parts = parts.slice(0, -1);
	}
	return `/${parts
		.map((s) => (s ? unescapeString(s, PATH_ESCAPES) : '-'))
		.join('/')}`;
}

/**
 * Parses a metadata value from command-line input string
 * to actual value.
 *
 * This method supports the following formats:
 * 1) "#123.4" => 123.4
 * 2) "[foo,bar]" => [ "foo", "bar" ]
 * 3) Everything else => unescaped string
 *
 * @param {string} value The command-line value to parse
 * @returns {string|number|string[]} The parsed value
 * @private
 */
function parseValue(value) {
	if (value.startsWith('#')) {
		// Try parsing as number
		let valueStr = unescapeString(value.substr(1));
		if (valueStr.match(NUMBER_REGEX)) {
			let parsedValue = parseFloat(valueStr);
			if (!Number.isNaN(parsedValue)) {
				return parsedValue;
			}
		}

		// Parsing failed, fall back to string value
	} else if (value.startsWith('[') && value.endsWith(']')) {
		// Handle as array
		let interiorStr = value.substring(1, value.length - 1);

		if (interiorStr.length === 0) {
			return [];
		}

		return interiorStr
			.split(UNESCAPED_COMMA_REGEX)
			.map((el) => unescapeString(el));
	}

	// No other parsing applied; treat as string
	return unescapeString(value);
}

/**
 * Parses a metadata command line string into the correct operation
 * object.
 *
 * This method performs the following transformations:
 * 1) key=value => {path: '/key', value: 'value'}
 * 2) key1>key2 => {from: '/key1', path: '/key2'}
 *
 * @param {string} input The input string from the command line
 * @returns {Object} The parsed metadata operation object
 * @private
 */
function parseMetadataString(input) {
	let chars = [...input];
	let op = {};

	// Find the splitting point, if one exists
	let splitIndex = chars.findIndex((char, index, arr) => {
		if (char === '>' || char === '=') {
			let escaped = false;
			for (let i = index - 1; i >= 0; i--) {
				if (arr[i] === '\\') {
					escaped = !escaped;
				} else {
					break;
				}
			}

			if (!escaped) {
				return true;
			}
		}

		return false;
	});

	if (splitIndex === -1) {
		// This is just a key, return it
		op.path = parseKey(chars.join(''));
		return op;
	}

	let separator = chars[splitIndex];
	if (separator === '>') {
		op.from = parseKey(chars.slice(0, splitIndex).join(''));
		op.path = parseKey(chars.slice(splitIndex + 1).join(''));
	} else {
		op.path = parseKey(chars.slice(0, splitIndex).join(''));
		op.value = parseValue(chars.slice(splitIndex + 1).join(''));
	}

	return op;
}

/**
 * Parse a string into a JSON object
 *
 * @param {string} inputString The string to parse
 * @param {string[]} keys The keys to parse from the string
 * @returns {Object} The parsed object
 */
function parseStringToObject(inputString, keys) {
	const result = {};

	while (inputString.length > 0) {
		inputString = inputString.trim();
		let parsedKey = inputString.split('=')[0];
		inputString = inputString.substring(inputString.indexOf('=') + 1);

		// Find the next key or the end of the string
		let nextKeyIndex = inputString.length;
		for (let key of keys) {
			let keyIndex = inputString.indexOf(key);
			if (keyIndex !== -1 && keyIndex < nextKeyIndex) {
				nextKeyIndex = keyIndex;
			}
		}

		let parsedValue = inputString.substring(0, nextKeyIndex).trim();
		if (parsedValue.endsWith(',') && nextKeyIndex !== inputString.length) {
			parsedValue = parsedValue.substring(0, parsedValue.length - 1);
		}
		if (parsedValue.startsWith('"') && parsedValue.endsWith('"')) {
			parsedValue = parsedValue.substring(1, parsedValue.length - 1);
		}

		if (!keys.includes(parsedKey)) {
			throw new BoxCLIError(
				`Invalid key '${parsedKey}'. Valid keys are ${keys.join(', ')}`
			);
		}

		result[parsedKey] = parsedValue;
		inputString = inputString.substring(nextKeyIndex);
	}
	return result;
}

/**
 * Check if directory exists and creates it if shouldCreate flag was passed.
 *
 * @param {string} dirPath Directory path to check and create
 * @param {boolean} shouldCreate Flag indicating if the directory should be created
 * @returns {Promise<void>} empty promise
 * @throws BoxCLIError
 */
async function checkDir(dirPath, shouldCreate) {
	/* eslint-disable no-sync */
	if (!fs.existsSync(dirPath)) {
		if (shouldCreate) {
			await mkdirp(dirPath);
		} else {
			throw new BoxCLIError(
				`The ${dirPath} path does not exist. Either create it, or pass the --create-path flag set to true`
			);
		}
	}
}

/* eslint-disable require-jsdoc, require-await, no-shadow, promise/avoid-new, promise/prefer-await-to-callbacks */

async function readFileAsync(path, options) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, options || {}, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

async function writeFileAsync(file, data, options) {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, options || {}, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

async function readdirAsync(path, options) {
	return new Promise((resolve, reject) => {
		fs.readdir(path, options || {}, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

async function unlinkAsync(path) {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

/* eslint-enable require-jsdoc, require-await, no-shadow, promise/avoid-new, promise/prefer-await-to-callbacks */

module.exports = {
	/**
	 * Validates the a configuration object has all required properties
	 * @param {Object} configObj The config object to validate
	 * @param {boolean} isCCG Whether the config object is used for CCG auth
	 * @returns {void}
	 * @throws BoxCLIError
	 */
	validateConfigObject(configObj, isCCG) {
		let checkProp = _.propertyOf(configObj);
		let requiredConfigValues = isCCG
			? REQUIRED_CONFIG_VALUES_CCG
			: REQUIRED_CONFIG_VALUES;
		let missingProp = requiredConfigValues.find((key) => !checkProp(key));

		if (missingProp) {
			throw new BoxCLIError(`Config object missing key ${missingProp}`);
		}
	},

	/**
	 * Parses a path argument or flag value into a full absolute path
	 *
	 * @param {string} value The raw path string from the command line flag or arg
	 * @returns {string} The resolved absolute path
	 */
	parsePath(value) {
		// Check for homedir and expand if necessary
		// @NOTE: This can occur when the user passes a path via --flag="~/my-stuff" syntax, since the shell
		// doesn't get a chance to expand the tilde
		value = value.replace(
			/^~(\/|\\|$)/u,
			(match, ending) => os.homedir() + ending
		);
		return path.resolve(value);
	},

	/**
	 * Unescape slashes from the given string.
	 *
	 * @param {string} value The raw string which can contains escaped slashes
	 * @returns {string} A string with unescaped escaping in newline and tab characters.
	 */
	unescapeSlashes(value) {
		try {
			return JSON.parse(`"${value}"`);
		} catch (e) {
			return value;
		}
	},

	/**
	 * Parses the key=val string format for metadata into an object {key: val}
	 *
	 * @param {string} value The string containing metadata key and value
	 * @returns {Object} The parsed metadata key and value
	 */
	parseMetadata(value) {
		let op = parseMetadataString(value);
		if (!op.hasOwnProperty('path') || !op.hasOwnProperty('value')) {
			throw new BoxCLIError('Metadata must be in the form key=value');
		}

		let pathSegments = op.path.slice(1).split('/');
		if (pathSegments.length !== 1) {
			throw new BoxCLIError(
				`Metadata value must be assigned to a top-level key, instead got ${op.path}`
			);
		}

		let key = pathSegments[0];

		return { [key]: op.value };
	},

	/**
	 * Parses strings like key=value or key1>key2 into objects
	 * used to help define JSON patch operations.
	 *
	 * key=value => {path: key, value: value}
	 * key1>key2 => {from: key1, path: key2}
	 * other => {path: other}
	 *
	 * @param {string} value The input string
	 * @returns {Object} The parsed operation object
	 */
	parseMetadataOp(value) {
		return parseMetadataString(value);
	},
	parseStringToObject,
	checkDir,
	readFileAsync,
	writeFileAsync,
	readdirAsync,
	unlinkAsync,
};
