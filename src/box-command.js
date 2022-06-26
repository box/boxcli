/* eslint-disable promise/prefer-await-to-callbacks,promise/avoid-new,class-methods-use-this  */
'use strict';

const { Command, flags } = require('@oclif/command');
const chalk = require('chalk');
const util = require('util');
const _ = require('lodash');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');
const csv = require('csv');
const csvParse = util.promisify(csv.parse);
const csvStringify = util.promisify(csv.stringify);
const dateTime = require('date-fns');
const BoxSDK = require('box-node-sdk');
const BoxCLIError = require('./cli-error');
const CLITokenCache = require('./token-cache');
const utils = require('./util');
const pkg = require('../package.json');
const inquirer = require('inquirer');
const darwinKeychain = require('keychain');
const { stringifyStream } = require('@discoveryjs/json-ext');
const darwinKeychainSetPassword = util.promisify(
	darwinKeychain.setPassword.bind(darwinKeychain)
);
const darwinKeychainGetPassword = util.promisify(
	darwinKeychain.getPassword.bind(darwinKeychain)
);

const DEBUG = require('./debug');
const stream = require('stream');
const pipeline = util.promisify(stream.pipeline);

const { Transform } = require('stream');

const KEY_MAPPINGS = {
	url: 'URL',
	id: 'ID',
	etag: 'ETag',
	sha1: 'SHA1',
	templateKey: 'Template Key',
	displayName: 'Display Name',
	tos: 'ToS',
	statusCode: 'Status Code',
	boxReportsFolderPath: 'Box Reports Folder Path',
	boxReportsFolderName: 'Box Reports Folder Name (Deprecated)',
	boxReportsFileFormat: 'Box Reports File Format',
	boxDownloadsFolderPath: 'Box Downloads Folder Path',
	boxDownloadsFolderName: 'Box Downloads Folder Name (Deprecated)',
	outputJson: 'Output JSON',
	clientId: 'Client ID',
	enterpriseId: 'Enterprise ID',
	boxConfigFilePath: 'Box Config File Path',
	hasInLinePrivateKey: 'Has Inline Private Key',
	privateKeyPath: 'Private Key Path',
	defaultAsUserId: 'Default As-User ID',
	useDefaultAsUser: 'Use Default As-User',
	cacheTokens: 'Cache Tokens',
	ip: 'IP',
	operationParams: 'Operation Params',
	copyInstanceOnItemCopy: 'Copy Instance On Item Copy',
};

const REQUIRED_FIELDS = ['type', 'id'];

const SDK_CONFIG = Object.freeze({
	iterators: true,
	analyticsClient: {
		name: 'box-cli',
		version: pkg.version,
	},
	request: {
		headers: {
			'User-Agent': `Box CLI v${pkg.version}`,
		},
	},
});

const CONFIG_FOLDER_PATH = path.join(os.homedir(), '.box');
const SETTINGS_FILE_PATH = path.join(CONFIG_FOLDER_PATH, 'settings.json');
const ENVIRONMENTS_FILE_PATH = path.join(
	CONFIG_FOLDER_PATH,
	'box_environments.json'
);

/**
 * Parse a string value from CSV into the correct boolean value
 * @param {string|boolean} value The value to parse
 * @returns {boolean} The parsed value
 * @private
 */
function getBooleanFlagValue(value) {
	let trueValues = ['yes', 'y', 'true', '1', 't', 'on'];
	let falseValues = ['no', 'n', 'false', '0', 'f', 'off'];
	if (typeof value === 'boolean') {
		return value;
	} else if (trueValues.includes(value.toLowerCase())) {
		return true;
	} else if (falseValues.includes(value.toLowerCase())) {
		return false;
	}
	let possibleValues = trueValues.concat(falseValues).join(', ');
	throw new Error(
		`Incorrect boolean value "${value}" passed. Possible values are ${possibleValues}`
	);
}

/**
 * Add or subtract a given offset from a date
 *
 * @param {Date} date The date to offset
 * @param {int} timeLength The number of time units to offset by
 * @param {string} timeUnit The unit of time to offset by, in single-character shorthand
 * @returns {Date} The date with offset applied
 */
function offsetDate(date, timeLength, timeUnit) {
	switch (timeUnit) {
		case 's':
			return dateTime.addSeconds(date, timeLength);
		case 'm':
			return dateTime.addMinutes(date, timeLength);
		case 'h':
			return dateTime.addHours(date, timeLength);
		case 'd':
			return dateTime.addDays(date, timeLength);
		case 'w':
			return dateTime.addWeeks(date, timeLength);
		case 'M':
			return dateTime.addMonths(date, timeLength);
		case 'y':
			return dateTime.addYears(date, timeLength);
		default:
			throw new Error(`Invalid time unit: ${timeUnit}`);
	}
}

/**
 * Formats an API key (e.g. field name) for human-readable display
 *
 * @param {string} key The key to format
 * @returns {string} The formatted key
 * @private
 */
function formatKey(key) {
	return key
		.split('_')
		.map((s) => KEY_MAPPINGS[s] || _.capitalize(s))
		.join(' ');
}

/**
 * Formats an object's keys for human-readable output
 * @param {*} obj The thing to format
 * @returns {*} The formatted thing
 * @private
 */
function formatObjectKeys(obj) {
	// No need to process primitive values
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	// Don't format metadata objects to avoid mangling keys
	if (obj.$type) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((el) => formatObjectKeys(el));
	}

	let formattedObj = Object.create(null);
	Object.keys(obj).forEach((key) => {
		let formattedKey = formatKey(key);
		formattedObj[formattedKey] = formatObjectKeys(obj[key]);
	});

	return formattedObj;
}

/**
 * Formats an object for output by prettifying its keys
 * and rendering it in a more human-readable form (i.e. YAML)
 *
 * @param {Object} obj The object to format for display
 * @returns {string} The formatted object output
 * @private
 */
function formatObject(obj) {
	let outputData = formatObjectKeys(obj);

	// Other objects are formatted as YAML for human-readable output
	let yamlString = yaml.safeDump(outputData, {
		indent: 4,
		noRefs: true,
	});

	// The YAML library puts a trailing newline at the end of the string, which is
	// redundant with the automatic newline added by oclif when writing to stdout
	return yamlString
		.replace(/\r?\n$/u, '')
		.replace(/^([^:]+:)/gmu, (match, key) => chalk.cyan(key));
}

/**
 * Formats the object header, used to separate multiple objects in a collection
 *
 * @param {Object} obj The object to generate a header for
 * @returns {string} The header string
 * @private
 */
function formatObjectHeader(obj) {
	if (!obj.type || !obj.id) {
		return chalk`{dim ----------}`;
	}
	return chalk`{dim ----- ${formatKey(obj.type)} ${obj.id} -----}`;
}

/**
 * Base class for all Box CLI commands
 */
class BoxCommand extends Command {
	// @TODO(2018-08-15): Move all fs methods used here to be async
	/* eslint-disable no-sync */

	/**
	 * Initialize before the command is run
	 * @returns {void}
	 */
	async init() {
		DEBUG.init('Initializing Box CLI');
		let originalArgs, originalFlags;
		if (
			this.argv.some((arg) => arg.startsWith('--bulk-file-path')) &&
			Object.keys(this.constructor.flags).includes('bulk-file-path')
		) {
			// Set up the command for bulk run
			DEBUG.init('Preparing for bulk input');
			this.isBulk = true;
			originalArgs = _.cloneDeep(this.constructor.args);
			originalFlags = _.cloneDeep(this.constructor.flags);
			this.disableRequiredArgsAndFlags();
		}

		/* eslint-disable no-shadow */
		let { flags, args } = this.parse(this.constructor);
		/* eslint-enable no-shadow */
		this.flags = flags;
		this.args = args;
		this.settings = await this._loadSettings();
		this.client = await this.getClient();

		if (this.isBulk) {
			this.constructor.args = originalArgs;
			this.constructor.flags = originalFlags;
			this.bulkOutputList = [];
			this.bulkErrors = [];
			this._singleRun = this.run;
			this.run = this.bulkOutputRun;
		}

		DEBUG.execute(
			'Starting execution command: %s argv: %O',
			this.id,
			this.argv
		);
	}

	/**
	 * Read in the input file and run the command once for each set of inputs
	 * @returns {void}
	 */
	async bulkOutputRun() {
		const allPossibleArgs = this.constructor.args.map((arg) => arg.name);
		const allPossibleFlags = Object.keys(this.constructor.flags);
		// Map from matchKey (arg/flag name in all lower-case characters) => {type, fieldKey}
		let fieldMapping = Object.assign(
			{},
			...allPossibleArgs.map((arg) => ({
				[arg.toLowerCase()]: { type: 'arg', fieldKey: arg },
			})),
			...allPossibleFlags.map((flag) => ({
				[flag.replace(/-/gu, '')]: { type: 'flag', fieldKey: flag },
			}))
		);
		let bulkCalls = await this._parseBulkFile(
			this.flags['bulk-file-path'],
			fieldMapping
		);
		let bulkEntryIndex = 0;
		for (let bulkData of bulkCalls) {
			/* eslint-disable no-await-in-loop */
			this.argv = [];
			bulkEntryIndex += 1;
			this._getArgsForBulkInput(allPossibleArgs, bulkData);
			this._setFlagsForBulkInput(bulkData);
			await this._handleAsUserSettings(bulkData);
			DEBUG.execute('Executing in bulk mode argv: %O', this.argv);
			// @TODO(2018-08-29): Convert this to a promise queue to improve performance
			/* eslint-disable no-await-in-loop */
			try {
				await this._singleRun();
			} catch (err) {
				// In bulk mode, we don't want to write directly to console and kill the command
				// Instead, we should buffer the error output so subsequent commands might be able to succeed
				DEBUG.execute('Caught error from bulk input entry %d', bulkEntryIndex);
				this.bulkErrors.push({
					index: bulkEntryIndex,
					data: bulkData,
					error: err,
				});
			}
			/* eslint-enable no-await-in-loop */
		}
		this.isBulk = false;
		DEBUG.execute('Leaving bulk mode and writing final output');
		await this.output(this.bulkOutputList);
		this._handleBulkErrors();
	}

	/**
	 * Logs bulk processing errors if any occured.
	 * @returns {void}
	 * @private
	 */
	_handleBulkErrors() {
		const numErrors = this.bulkErrors.length;
		if (numErrors === 0) {
			this.info(chalk`{green All bulk input entries processed successfully.}`);
			return;
		}
		this.info(
			chalk`{redBright ${numErrors} entr${numErrors > 1 ? 'ies' : 'y'} failed!}`
		);
		this.bulkErrors.forEach((errorInfo) => {
			this.info(chalk`{dim ----------}`);
			let entryData = errorInfo.data
				.map((o) => `    ${o.fieldKey}=${o.value}`)
				.join(os.EOL);
			this.info(
				chalk`{redBright Entry ${errorInfo.index} (${
					os.EOL + entryData + os.EOL
				}) failed with error:}`
			);
			let err = errorInfo.error;
			let errMsg = chalk`{redBright ${
				this.flags && this.flags.verbose ? err.stack : err.message
			}${os.EOL}}`;
			this.info(errMsg);
		});
	}

	/**
	 * Set as-user header from the bulk file or use the default one.
	 * @param {Array} bulkData Bulk data
	 * @returns {Promise<void>} Returns nothing
	 * @private
	 */
	async _handleAsUserSettings(bulkData) {
		let asUser = bulkData.find((o) => o.fieldKey === 'as-user') || {};
		if (!_.isEmpty(asUser)) {
			if (_.isNil(asUser.value)) {
				let environmentsObj = await this.getEnvironments(); // eslint-disable-line no-await-in-loop
				if (environmentsObj.default) {
					let environment =
						environmentsObj.environments[environmentsObj.default];
					DEBUG.init(
						'Using environment %s %O',
						environmentsObj.default,
						environment
					);
					if (environment.useDefaultAsUser) {
						this.client.asUser(environment.defaultAsUserId);
						DEBUG.init(
							'Impersonating default user ID %s',
							environment.defaultAsUserId
						);
					} else {
						this.client.asSelf();
					}
				} else {
					this.client.asSelf();
				}
			} else {
				this.client.asUser(asUser.value);
				DEBUG.init('Impersonating user ID %s', asUser.value);
			}
		}
	}

	/**
	 * Include flag values from command line first,
	 * they'll automatically be overwritten/combined with later values by the oclif parser.
	 * @param {Array} bulkData Bulk data
	 * @returns {void}
	 * @private
	 */
	_setFlagsForBulkInput(bulkData) {
		Object.keys(this.flags)
			.filter((flag) => flag !== 'bulk-file-path') // Remove the bulk file path flag so we don't recurse!
			.forEach((flag) => {
				// Some flags can be specified multiple times in a single command. For these flags, their value is an array of user inputted values.
				// For these flags, we iterate through their values and add each one as a separate flag to comply with oclif
				if (Array.isArray(this.flags[flag])) {
					this.flags[flag].forEach((value) => {
						this._addFlagToArgv(flag, value);
					});
				} else {
					this._addFlagToArgv(flag, this.flags[flag]);
				}
			});
		// Include all flag values from bulk input, which will override earlier ones
		// from the command line
		bulkData
			// Remove the bulk file path flag so we don't recurse!
			.filter((o) => o.type === 'flag' && o.fieldKey !== 'bulk-file-path')
			.forEach((o) => this._addFlagToArgv(o.fieldKey, o.value));
	}

	/**
	 * For each possible arg, find the correct value between bulk input and values given on the command line.
	 * @param {Array} allPossibleArgs All possible args
	 * @param {Array} bulkData Bulk data
	 * @returns {void}
	 * @private
	 */
	_getArgsForBulkInput(allPossibleArgs, bulkData) {
		for (let arg of allPossibleArgs) {
			let bulkArg = bulkData.find((o) => o.fieldKey === arg) || {};
			if (!_.isNil(bulkArg.value)) {
				// Use value from bulk input file when available
				this.argv.push(bulkArg.value);
			} else if (this.args[arg]) {
				// Fall back to value from command line
				this.argv.push(this.args[arg]);
			}
		}
	}

	/**
	 * Parses file wilk bulk commands
	 * @param {String} filePath Path to file with bulk commands
	 * @param {Array} fieldMapping Data to parse
	 * @returns {Promise<*>} Returns parsed data
	 * @private
	 */
	async _parseBulkFile(filePath, fieldMapping) {
		const fileExtension = path.extname(filePath);
		const fileContents = this._readBulkFile(filePath);
		let bulkCalls;
		if (fileExtension === '.json') {
			bulkCalls = this._handleJsonFile(fileContents, fieldMapping);
		} else if (fileExtension === '.csv') {
			bulkCalls = await this._handleCsvFile(fileContents, fieldMapping);
		} else {
			throw new Error(
				`Input file had extension "${fileExtension}", but only .json and .csv are supported`
			);
		}
		// Filter out any undefined values, which can arise when the input file contains extraneous keys
		bulkCalls = bulkCalls.map((args) => args.filter((o) => o !== undefined));
		DEBUG.execute(
			'Read %d entries from bulk file %s',
			bulkCalls.length,
			this.flags['bulk-file-path']
		);
		return bulkCalls;
	}

	/**
	 * Parses CSV file
	 * @param {Object} fileContents File content to parse
	 * @param {Array} fieldMapping Field mapings
	 * @returns {Promise<string|null|*>} Returns parsed data
	 * @private
	 */
	async _handleCsvFile(fileContents, fieldMapping) {
		let parsedData = await csvParse(fileContents, {
			delimiter: ',',
			cast(value, context) {
				if (value.length === 0) {
					// Regard unquoted empty values as null
					return context.quoting ? '' : null;
				}
				return value;
			},
		});
		if (parsedData.length < 2) {
			throw new Error(
				'CSV input file should contain the headers row and at least on data row'
			);
		}
		// @NOTE: We don't parse the CSV into an aray of Objects
		// and instead mainatain a separate array of headers, in
		// order to ensure that ordering is maintained in the keys
		let headers = parsedData.shift().map((key) => {
			let keyParts = key.match(/(.*)_\d+$/u);
			let someKey = keyParts ? keyParts[1] : key;
			return someKey.toLowerCase().replace(/[-_]/gu, '');
		});
		return parsedData.map((values) =>
			values.map((value, index) => {
				let key = headers[index];
				let field = fieldMapping[key];
				return field ? { ...field, value } : undefined;
			})
		);
	}

	/**
	 * Parses JSON file
	 * @param {Object} fileContents File content to parse
	 * @param {Array} fieldMapping Field mapings
	 * @returns {*} Returns parsed data
	 * @private
	 */
	_handleJsonFile(fileContents, fieldMapping) {
		let parsedData;
		try {
			let jsonFile = JSON.parse(fileContents);
			parsedData = jsonFile.hasOwnProperty('entries')
				? jsonFile.entries
				: jsonFile;
		} catch (e) {
			throw new BoxCLIError(
				`Could not parse JSON input file ${this.flags['bulk-file-path']}`,
				e
			);
		}
		if (!Array.isArray(parsedData)) {
			throw new TypeError(
				'Expected input file to contain an array of input objects, but none found'
			);
		}
		// Translate each row object to an array of {type, fieldKey, value}, to be handled below
		return parsedData.map(function flattenObjectToArgs(obj) {
			// One top-level object key can map to multiple args/flags, so we need to deeply flatten after mapping
			return _.flatMapDeep(obj, (value, key) => {
				let matchKey = key.toLowerCase().replace(/[-_]/gu, '');
				let field = fieldMapping[matchKey];
				if (_.isPlainObject(value)) {
					// Map e.g. { item: { id: 12345, type: folder } } => { item: 12345, itemtype: folder }
					// @NOTE: For now, we only support nesting keys this way one level deep
					return Object.keys(value).map((nestedKey) => {
						let nestedMatchKey =
							matchKey + nestedKey.toLowerCase().replace(/[-_]/gu, '');
						let nestedField = fieldMapping[nestedMatchKey];
						return nestedField
							? { ...nestedField, value: value[nestedKey] }
							: undefined;
					});
				} else if (Array.isArray(value)) {
					// Arrays can be one of two things: an array of values for a single key,
					// or an array of grouped flags/args as objects
					// First, check if everything in the array is either all object or all non-object
					let types = value.reduce((acc, t) => acc.concat(typeof t), []);
					if (
						types.some((t) => t !== 'object') &&
						types.some((t) => t === 'object')
					) {
						throw new BoxCLIError(
							'Mixed types in bulk input JSON array; use strings or Objects'
						);
					}
					// If everything in the array is objects, handle each one as a group of flags and args
					// by recursively parsing that object into args
					if (types[0] === 'object') {
						return value.map((o) => flattenObjectToArgs(o));
					}
					// If the array is of values for this field, just return those
					return field ? value.map((v) => ({ ...field, value: v })) : [];
				}
				return field ? { ...field, value } : undefined;
			});
		});
	}

	/**
	 * Returns bulk file contents
	 * @param {String} filePath Path to bulk file
	 * @returns {Buffer} Bulk file contents
	 * @private
	 */
	_readBulkFile(filePath) {
		try {
			const fileContents = fs.readFileSync(filePath);
			DEBUG.execute('Read bulk input file at %s', filePath);
			return fileContents;
		} catch (ex) {
			throw new BoxCLIError(`Could not open input file ${filePath}`, ex);
		}
	}

	/**
	 * Writes a given flag value to the command's argv array
	 *
	 * @param {string} flag The flag name
	 * @param {*} flagValue The flag value
	 * @returns {void}
	 * @private
	 */
	_addFlagToArgv(flag, flagValue) {
		if (_.isNil(flagValue)) {
			return;
		}

		if (this.constructor.flags[flag].type === 'boolean') {
			if (getBooleanFlagValue(flagValue)) {
				this.argv.push(`--${flag}`);
			} else {
				this.argv.push(`--no-${flag}`);
			}
		} else {
			this.argv.push(`--${flag}=${flagValue}`);
		}
	}

	/**
	 * Ensure that all args and flags for the command are not marked as required,
	 * to avoid issues when filling in required values from the input file.
	 * @returns {void}
	 */
	disableRequiredArgsAndFlags() {
		Object.keys(this.constructor.args).forEach((key) => {
			this.constructor.args[key].required = false;
		});
		Object.keys(this.constructor.flags).forEach((key) => {
			this.constructor.flags[key].required = false;
		});
	}

	/**
	 * Instantiate the SDK client for making API calls
	 *
	 * @returns {BoxClient} The client for making API calls in the command
	 */
	async getClient() {
		// Allow some commands (e.g. configure:environments:add, login) to skip client setup so they can run
		if (this.constructor.noClient) {
			return null;
		}
		let environmentsObj = await this.getEnvironments();
		let client;
		if (this.flags.token) {
			DEBUG.init('Using passed in token %s', this.flags.token);
			let sdk = new BoxSDK({
				clientID: '',
				clientSecret: '',
				...SDK_CONFIG,
			});
			this._configureSdk(sdk, { ...SDK_CONFIG });
			this.sdk = sdk;
			client = sdk.getBasicClient(this.flags.token);
		} else if (
			environmentsObj.default &&
			environmentsObj.environments[environmentsObj.default].authMethod ===
				'oauth20'
		) {
			try {
				let environment = environmentsObj.environments[environmentsObj.default];
				DEBUG.init(
					'Using environment %s %O',
					environmentsObj.default,
					environment
				);
				let tokenCache = new CLITokenCache(environmentsObj.default);

				let sdk = new BoxSDK({
					clientID: environment.clientId,
					clientSecret: environment.clientSecret,
					...SDK_CONFIG,
				});
				this._configureSdk(sdk, { ...SDK_CONFIG });
				this.sdk = sdk;
				let tokenInfo = await new Promise((resolve, reject) => {
					// eslint-disable-line promise/avoid-new
					tokenCache.read((error, localTokenInfo) => {
						if (error) {
							reject(error);
						} else {
							resolve(localTokenInfo);
						}
					});
				});
				client = sdk.getPersistentClient(tokenInfo, tokenCache);
			} catch (err) {
				throw new BoxCLIError(
					`Can't load the default OAuth environment "${environmentsObj.default}". Please login again or provide a token.`
				);
			}
		} else if (environmentsObj.default) {
			let environment = environmentsObj.environments[environmentsObj.default];
			DEBUG.init(
				'Using environment %s %O',
				environmentsObj.default,
				environment
			);
			let tokenCache =
				environment.cacheTokens === false
					? null
					: new CLITokenCache(environmentsObj.default);
			let configObj;
			try {
				configObj = JSON.parse(fs.readFileSync(environment.boxConfigFilePath));
			} catch (ex) {
				throw new BoxCLIError('Could not read environments config file', ex);
			}

			if (!environment.hasInLinePrivateKey) {
				try {
					configObj.boxAppSettings.appAuth.privateKey = fs.readFileSync(
						environment.privateKeyPath,
						'utf8'
					);
					DEBUG.init(
						'Loaded JWT private key from %s',
						environment.privateKeyPath
					);
				} catch (ex) {
					throw new BoxCLIError(
						`Could not read private key file ${environment.privateKeyPath}`,
						ex
					);
				}
			}

			this.sdk = BoxSDK.getPreconfiguredInstance(configObj);
			this._configureSdk(this.sdk, { ...SDK_CONFIG });

			client = this.sdk.getAppAuthClient(
				'enterprise',
				environment.enterpriseId,
				tokenCache
			);
			DEBUG.init('Initialized client from environment config');

			if (environment.useDefaultAsUser) {
				client.asUser(environment.defaultAsUserId);
				DEBUG.init(
					'Impersonating default user ID %s',
					environment.defaultAsUserId
				);
			}
		} else {
			// No environments set up yet!
			throw new BoxCLIError(
				`No default environment found.
				It looks like you haven't configured the Box CLI yet.
				See this command for help adding an environment: box configure:environments:add --help
				Or, supply a token with your command with --token.`.replace(/^\s+/gmu, '')
			);
		}
		if (this.flags['as-user']) {
			client.asUser(this.flags['as-user']);
			DEBUG.init('Impersonating user ID %s', this.flags['as-user']);
		}

		return client;
	}

	/**
	 * Configures SDK by using values from settings.json file
	 * @param {*} sdk to configure
	 * @param {*} config Additional options to use while building configuration
	 * @returns {void}
	 */
	_configureSdk(sdk, config = {}) {
		const clientSettings = { ...config };
		if (this.settings.enableProxy) {
			clientSettings.proxy = this.settings.proxy;
		}
		if (this.settings.apiRootURL) {
			clientSettings.apiRootURL = this.settings.apiRootURL;
		}
		if (this.settings.uploadAPIRootURL) {
			clientSettings.uploadAPIRootURL = this.settings.uploadAPIRootURL;
		}
		if (this.settings.authorizeRootURL) {
			clientSettings.authorizeRootURL = this.settings.authorizeRootURL;
		}
		if (this.settings.numMaxRetries) {
			clientSettings.numMaxRetries = this.settings.numMaxRetries;
		}
		if (this.settings.retryIntervalMS) {
			clientSettings.retryIntervalMS = this.settings.retryIntervalMS;
		}
		if (this.settings.uploadRequestTimeoutMS) {
			clientSettings.uploadRequestTimeoutMS =
				this.settings.uploadRequestTimeoutMS;
		}
		if (Object.keys(clientSettings).length > 0) {
			DEBUG.init('SDK client settings %s', clientSettings);
			sdk.configure(clientSettings);
		}
	}

	/**
	 * Format data for output to stdout
	 * @param {*} content The content to output
	 * @returns {Promise<void>} A promise resolving when output is handled
	 */
	async output(content) {
		if (this.isBulk) {
			this.bulkOutputList.push(content);
			DEBUG.output(
				'Added command output to bulk list total: %d',
				this.bulkOutputList.length
			);
			return undefined;
		}

		let formattedOutputData;
		if (Array.isArray(content)) {
			// Format each object individually and then flatten in case this an array of arrays,
			// which happens when a command that outputs a collection gets run in bulk
			formattedOutputData = _.flatten(
				await Promise.all(content.map((o) => this._formatOutputObject(o)))
			);
			DEBUG.output('Formatted %d output entries for display', content.length);
		} else {
			formattedOutputData = await this._formatOutputObject(content);
			DEBUG.output('Formatted output content for display');
		}
		let outputFormat = this._getOutputFormat();
		DEBUG.output('Using %s output format', outputFormat);
		DEBUG.output(formattedOutputData);

		let writeFunc;
		let logFunc;
		let stringifiedOutput;

		if (outputFormat === 'json') {
			stringifiedOutput = stringifyStream(formattedOutputData, null, 4);

			let appendNewLineTransform = new Transform({
				transform(chunk, encoding, callback) {
					callback(null, chunk);
				},
				flush(callback) {
					this.push(os.EOL);
					callback();
				},
			});

			writeFunc = async (savePath) => {
				await pipeline(
					stringifiedOutput,
					appendNewLineTransform,
					fs.createWriteStream(savePath, { encoding: 'utf8' })
				);
			};

			logFunc = async () => {
				await this.logStream(stringifiedOutput);
			};
		} else {
			stringifiedOutput = await this._stringifyOutput(formattedOutputData);

			writeFunc = async (savePath) => {
				await fs.writeFile(savePath, stringifiedOutput + os.EOL, {
					encoding: 'utf8',
				});
			};

			logFunc = () => this.log(stringifiedOutput);
		}
		return this._writeOutput(writeFunc, logFunc);
	}

	/**
	 * Prepare the output data by:
	 *   1) Unrolling an iterator into an array
	 *   2) Filtering out unwanted object fields
	 *
	 * @param {*} obj The raw object containing output data
	 * @returns {*} The formatted output data
	 * @private
	 */
	async _formatOutputObject(obj) {
		let output = obj;

		// Pass primitive content types through
		if (typeof output !== 'object' || output === null) {
			return output;
		}

		// Unroll iterator into array
		if (typeof obj.next === 'function') {
			output = [];
			let entry = await obj.next();
			while (!entry.done) {
				output.push(entry.value);
				/* eslint-disable no-await-in-loop */
				entry = await obj.next();
				/* eslint-enable no-await-in-loop */
			}
			DEBUG.output('Unrolled iterable into %d entries', output.length);
		}

		if (this.flags['id-only']) {
			output = Array.isArray(output)
				? this.filterOutput(output, 'id')
				: output.id;
		} else {
			output = this.filterOutput(output, this.flags.fields);
		}

		return output;
	}

	/**
	 * Get the output format (and file extension) based on the settings and flags set
	 *
	 * @returns {string} The file extension/format to use for output
	 * @private
	 */
	_getOutputFormat() {
		if (this.flags.json) {
			return 'json';
		}

		if (this.flags.csv) {
			return 'csv';
		}

		if (this.flags.save || this.flags['save-to-file-path']) {
			return this.settings.boxReportsFileFormat || 'txt';
		}

		if (this.settings.outputJson) {
			return 'json';
		}

		return 'txt';
	}

	/**
	 * Converts output data to a string based on the type of content and flags the user
	 * has specified regarding output format
	 *
	 * @param {*} outputData The data to output
	 * @returns {string} Promise resolving to the output data as a string
	 * @private
	 */
	async _stringifyOutput(outputData) {
		let outputFormat = this._getOutputFormat();

		if (typeof outputData !== 'object') {
			DEBUG.output('Primitive output cast to string');
			return String(outputData);
		} else if (outputFormat === 'csv') {
			let csvString = await csvStringify(
				this.formatForTableAndCSVOutput(outputData)
			);
			// The CSV library puts a trailing newline at the end of the string, which is
			// redundant with the automatic newline added by oclif when writing to stdout
			DEBUG.output('Processed output as CSV');
			return csvString.replace(/\r?\n$/u, '');
		} else if (Array.isArray(outputData)) {
			let str = outputData
				.map((o) => `${formatObjectHeader(o)}${os.EOL}${formatObject(o)}`)
				.join(os.EOL.repeat(2));
			DEBUG.output('Processed collection into human-readable output');
			return str;
		}

		let str = formatObject(outputData);
		DEBUG.output('Processed human-readable output');
		return str;
	}

	/**
	 * Generate an appropriate default filename for writing
	 * the output of this command to disk.
	 *
	 * @returns {string} The output file name
	 * @private
	 */
	_getOutputFileName() {
		let extension = this._getOutputFormat();
		return `${this.id.replace(/:/gu, '-')}-${dateTime.format(
			new Date(),
			'YYYY-MM-DD_HH_mm_ss_SSS'
		)}.${extension}`;
	}

	/**
	 * Write output to its final destination, either a file or stdout
	 * @param {Function} writeFunc Function used to save output to a file
	 * @param {Function} logFunc Function used to print output to stdout
	 * @returns {Promise<void>} A promise resolving when output is written
	 * @private
	 */
	async _writeOutput(writeFunc, logFunc) {
		if (this.flags.save) {
			DEBUG.output('Writing output to default location on disk');
			let filePath = path.join(
				this.settings.boxReportsFolderPath,
				this._getOutputFileName()
			);
			try {
				await writeFunc(filePath);
			} catch (ex) {
				throw new BoxCLIError(
					`Could not write output to file at ${filePath}`,
					ex
				);
			}
			this.info(chalk`{green Output written to ${filePath}}`);
		} else if (this.flags['save-to-file-path']) {
			let savePath = this.flags['save-to-file-path'];
			if (fs.existsSync(savePath)) {
				if (fs.statSync(savePath).isDirectory()) {
					// Append default file name and write into the provided directory
					savePath = path.join(savePath, this._getOutputFileName());
					DEBUG.output(
						'Output path is a directory, will write to %s',
						savePath
					);
				} else {
					DEBUG.output('File already exists at %s', savePath);
					// Ask if the user want to overwrite the file
					let shouldOverwrite = await this.confirm(
						`File ${savePath} already exists — overwrite?`
					);

					if (!shouldOverwrite) {
						return;
					}
				}
			}
			try {
				DEBUG.output(
					'Writing output to specified location on disk: %s',
					savePath
				);
				await writeFunc(savePath);
			} catch (ex) {
				throw new BoxCLIError(
					`Could not write output to file at ${savePath}`,
					ex
				);
			}
			this.info(chalk`{green Output written to ${savePath}}`);
		} else {
			DEBUG.output('Writing output to terminal');
			await logFunc();
		}

		DEBUG.output('Finished writing output');
	}

	/**
	 * Ask a user to confirm something, respecting the default --yes flag
	 *
	 * @param {string} promptText The text of the prompt to the user
	 * @param {boolean} defaultValue The default value of the prompt
	 * @returns {Promise<boolean>} A promise resolving to a boolean that is true iff the user confirmed
	 */
	async confirm(promptText, defaultValue = false) {
		if (this.flags.yes) {
			return true;
		}

		let answers = await inquirer.prompt([
			{
				name: 'confirmation',
				message: promptText,
				type: 'confirm',
				default: defaultValue,
			},
		]);

		return answers.confirmation;
	}

	/**
	 * Writes output to stderr — this should be used for informational output.  For example, a message
	 * stating that an item has been deleted.
	 *
	 * @param {string} content The message to output
	 * @returns {void}
	 */
	info(content) {
		if (!this.flags.quiet) {
			process.stderr.write(`${content}${os.EOL}`);
		}
	}

	/**
	 * Writes output to stderr — this should be used for informational output.  For example, a message
	 * stating that an item has been deleted.
	 *
	 * @param {string} content The message to output
	 * @returns {void}
	 */
	log(content) {
		if (!this.flags.quiet) {
			super.log(content);
		}
	}

	/**
	 * Writes stream output to stderr — this should be used for informational output.  For example, a message
	 * stating that an item has been deleted.
	 *
	 * @param {ReadableStream} content The message to output
	 * @returns {void}
	 */
	async logStream(content) {
		if (!this.flags.quiet) {
			// For Node 12 when process.stdout is in pipeline it's not emitting end event correctly and it freezes.
			// See - https://github.com/nodejs/node/issues/34059
			// Using promise for now.
			content.pipe(process.stdout);

			await new Promise((resolve, reject) => {
				content
					.on('end', () => {
						process.stdout.write(os.EOL);
						resolve();
					})
					.on('error', (err) => {
						reject(err);
					});
			});
		}
	}

	/**
	 * Handles an error thrown within a command
	 *
	 * @param {Error} err  The thrown error
	 * @returns {void}
	 */
	async catch(err) {
		try {
			// Let the oclif default handler run first, since it handles the help and version flags there
			/* eslint-disable promise/no-promise-in-callback */
			DEBUG.execute('Running framework error handler');
			await super.catch(err);
			/* eslint-disable no-shadow,no-catch-shadow */
		} catch (err) {
			// The oclif default catch handler rethrows most errors; handle those here
			DEBUG.execute('Handling re-thrown error in base command handler');

			if (err.code === 'EEXIT') {
				// oclif throws this when it handled the error itself and wants to exit, so just let it do that
				DEBUG.execute('Got EEXIT code, exiting immediately');
				return;
			}

			let errorMsg = chalk`{redBright ${
				this.flags && this.flags.verbose ? err.stack : err.message
			}${os.EOL}}`;

			// Write the error message but let the process exit gracefully with error code so stderr gets written out
			// @NOTE: Exiting the process in the callback enables tests to mock out stderr and run to completion!
			/* eslint-disable no-process-exit,unicorn/no-process-exit */
			process.stderr.write(errorMsg, 'utf8', () => process.exit(2));
			/* eslint-enable no-process-exit,unicorn/no-process-exit */
		}
	}

	/**
	 * Final hook that executes for all commands, regardless of if an error occurred
	 * @param {Error} [err] An error, if one occurred
	 * @returns {void}
	 */
	async finally(/* err */) {
		// called after run and catch regardless of whether or not the command errored
	}

	/**
	 * Filter out unwanted fields from the output object(s)
	 *
	 * @param {Object|Object[]} output The output object(s)
	 * @param {string} [fields] Comma-separated list of fields to include
	 * @returns {Object|Object[]} The filtered object(s) for output
	 */
	filterOutput(output, fields) {
		if (!fields) {
			return output;
		}
		fields = REQUIRED_FIELDS.concat(
			fields.split(',').filter((f) => !REQUIRED_FIELDS.includes(f))
		);
		DEBUG.output('Filtering output with fields: %O', fields);
		if (Array.isArray(output)) {
			output = output.map((o) =>
				typeof o === 'object' ? _.pick(o, fields) : o
			);
		} else if (typeof output === 'object') {
			output = _.pick(output, fields);
		}
		return output;
	}

	/**
	 * Flatten nested objects for output to a table/CSV
	 *
	 * @param {Object[]} objectArray The objects that will be output
	 * @returns {Array[]} The formatted output
	 */
	formatForTableAndCSVOutput(objectArray) {
		let formattedData = [];
		if (!Array.isArray(objectArray)) {
			objectArray = [objectArray];
			DEBUG.output('Creating tabular output from single object');
		}

		let keyPaths = [];
		for (let object of objectArray) {
			keyPaths = _.union(keyPaths, this.getNestedKeys(object));
		}

		DEBUG.output('Found %d keys for tabular output', keyPaths.length);
		formattedData.push(keyPaths);
		for (let object of objectArray) {
			let row = [];
			if (typeof object === 'object') {
				for (let keyPath of keyPaths) {
					let value = _.get(object, keyPath);
					if (value === null || value === undefined) {
						row.push('');
					} else {
						row.push(value);
					}
				}
			} else {
				row.push(object);
			}
			DEBUG.output('Processed row with %d values', row.length);
			formattedData.push(row);
		}
		DEBUG.output(
			'Processed %d rows of tabular output',
			formattedData.length - 1
		);
		return formattedData;
	}

	/**
	 * Extracts all keys from an object and flattens them
	 *
	 * @param {Object} object The object to extract flattened keys from
	 * @returns {string[]} The array of flattened keys
	 */
	getNestedKeys(object) {
		let keys = [];
		if (typeof object === 'object') {
			for (let key in object) {
				if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
					let subKeys = this.getNestedKeys(object[key]);
					subKeys = subKeys.map((x) => `${key}.${x}`);
					keys = keys.concat(subKeys);
				} else {
					keys.push(key);
				}
			}
		}
		return keys;
	}

	/**
	 * Converts time interval shorthand like 5w, -3d, etc to timestamps. It also ensures any timestamp
	 * passed in is properly formatted for API calls.
	 *
	 * @param {string} time The command lint input string for the datetime
	 * @returns {string} The full RFC3339-formatted datetime string in UTC
	 */
	static normalizeDateString(time) {
		// Attempt to parse date as timestamp or string
		let newDate = time.match(/^\d+$/u)
			? dateTime.parse(parseInt(time, 10) * 1000)
			: dateTime.parse(time);
		if (!dateTime.isValid(newDate)) {
			let parsedOffset = time.match(/^(-?)((?:\d+[smhdwMy])+)$/u);
			if (parsedOffset) {
				let sign = parsedOffset[1] === '-' ? -1 : 1,
					offset = parsedOffset[2];

				// Transform a string like "-1d2h3m" into an array of arg arrays, e.g.:
				// [ [-1, "d"], [-2, "h"], [-3, "m"] ]
				let argPairs = _.chunk(offset.split(/(\d+)/u).slice(1), 2).map(
					(pair) => [sign * parseInt(pair[0], 10), pair[1]]
				);

				// Successively apply the offsets to the current time
				newDate = argPairs.reduce(
					(d, args) => offsetDate(d, ...args),
					new Date()
				);
			} else if (time === 'now') {
				newDate = new Date();
			} else {
				throw new BoxCLIError(`Cannot parse date format "${time}"`);
			}
		}

		// Format the timezone to RFC3339 format for the Box API
		// Also always use UTC timezone for consistency in tests
		return newDate.toISOString().replace(/\.\d{3}Z$/u, '+00:00');
	}

	/**
	 * Writes updated settings to disk
	 *
	 * @param {Object} updatedSettings The settings object to write
	 * @returns {void}
	 */
	updateSettings(updatedSettings) {
		this.settings = Object.assign(this.settings, updatedSettings);
		try {
			fs.writeFileSync(
				SETTINGS_FILE_PATH,
				JSON.stringify(this.settings, null, 4),
				'utf8'
			);
		} catch (ex) {
			throw new BoxCLIError(
				`Could not write settings file ${SETTINGS_FILE_PATH}`,
				ex
			);
		}
		return this.settings;
	}

	/**
	 * Read the current set of environments from disk
	 *
	 * @returns {Object} The parsed environment information
	 */
	async getEnvironments() {
		try {
			switch (process.platform) {
				case 'darwin': {
					try {
						const password = await darwinKeychainGetPassword({
							account: 'Box',
							service: 'boxcli',
						});
						return JSON.parse(password);
					} catch {
						// fallback to env file if not found
					}
					break;
				}

				default:
			}
			return JSON.parse(fs.readFileSync(ENVIRONMENTS_FILE_PATH));
		} catch (ex) {
			throw new BoxCLIError(
				`Could not read environments config file ${ENVIRONMENTS_FILE_PATH}`,
				ex
			);
		}
	}

	/**
	 * Writes updated environment information to disk
	 *
	 * @param {Object} updatedEnvironments The environment information to write
	 * @param {Object} environments use to override current environment
	 * @returns {void}
	 */
	async updateEnvironments(updatedEnvironments, environments) {
		if (typeof environments === 'undefined') {
			environments = await this.getEnvironments();
		}
		Object.assign(environments, updatedEnvironments);
		try {
			let fileContents = JSON.stringify(environments, null, 4);
			switch (process.platform) {
				case 'darwin': {
					await darwinKeychainSetPassword({
						account: 'Box',
						service: 'boxcli',
						password: JSON.stringify(environments),
					});
					fileContents = '';
					break;
				}

				default:
			}

			fs.writeFileSync(ENVIRONMENTS_FILE_PATH, fileContents, 'utf8');
		} catch (ex) {
			throw new BoxCLIError(
				`Could not write environments config file ${ENVIRONMENTS_FILE_PATH}`,
				ex
			);
		}
		return environments;
	}

	/**
	 * Initialize the CLI by creating the necessary configuration files on disk
	 * in the users' home directory, then read and parse the CLI settings file.
	 *
	 * @returns {Object} The parsed settings
	 * @private
	 */
	async _loadSettings() {
		try {
			if (!fs.existsSync(CONFIG_FOLDER_PATH)) {
				fs.mkdirpSync(CONFIG_FOLDER_PATH);
				DEBUG.init('Created config folder at %s', CONFIG_FOLDER_PATH);
			}
			if (!fs.existsSync(ENVIRONMENTS_FILE_PATH)) {
				await this.updateEnvironments({}, this._getDefaultEnvironments());
				DEBUG.init('Created environments config at %s', ENVIRONMENTS_FILE_PATH);
			}
			if (!fs.existsSync(SETTINGS_FILE_PATH)) {
				let settingsJSON = JSON.stringify(this._getDefaultSettings(), null, 4);
				fs.writeFileSync(SETTINGS_FILE_PATH, settingsJSON, 'utf8');
				DEBUG.init(
					'Created settings file at %s %O',
					SETTINGS_FILE_PATH,
					settingsJSON
				);
			}
		} catch (ex) {
			throw new BoxCLIError('Could not initialize CLI home directory', ex);
		}

		let settings;
		try {
			settings = JSON.parse(fs.readFileSync(SETTINGS_FILE_PATH));
			settings = Object.assign(this._getDefaultSettings(), settings);
			DEBUG.init('Loaded settings %O', settings);
		} catch (ex) {
			throw new BoxCLIError(
				`Could not read CLI settings file at ${SETTINGS_FILE_PATH}`,
				ex
			);
		}

		try {
			if (!fs.existsSync(settings.boxReportsFolderPath)) {
				fs.mkdirpSync(settings.boxReportsFolderPath);
				DEBUG.init(
					'Created reports folder at %s',
					settings.boxReportsFolderPath
				);
			}
			if (!fs.existsSync(settings.boxDownloadsFolderPath)) {
				fs.mkdirpSync(settings.boxDownloadsFolderPath);
				DEBUG.init(
					'Created downloads folder at %s',
					settings.boxDownloadsFolderPath
				);
			}
		} catch (ex) {
			throw new BoxCLIError('Failed creating CLI working directory', ex);
		}

		return settings;
	}

	/**
	 * Get the default settings object
	 *
	 * @returns {Object} The default settings object
	 * @private
	 */
	_getDefaultSettings() {
		return {
			boxReportsFolderPath: path.join(os.homedir(), 'Documents/Box-Reports'),
			boxReportsFileFormat: 'txt',
			boxDownloadsFolderPath: path.join(
				os.homedir(),
				'Downloads/Box-Downloads'
			),
			outputJson: false,
			enableProxy: false,
			proxy: {
				url: null,
				username: null,
				password: null,
			},
		};
	}

	/**
	 * Get the default environments object
	 *
	 * @returns {Object} The default environments object
	 * @private
	 */
	_getDefaultEnvironments() {
		return {
			default: null,
			environments: {},
		};
	}
}

BoxCommand.flags = {
	token: flags.string({
		char: 't',
		description: 'Provide a token to perform this call',
	}),
	'as-user': flags.string({ description: 'Provide an ID for a user' }),
	// @NOTE: This flag is not read anywhere directly; the chalk library automatically turns off color when it's passed
	'no-color': flags.boolean({
		description: 'Turn off colors for logging',
	}),
	json: flags.boolean({
		description: 'Output formatted JSON',
		exclusive: ['csv'],
	}),
	csv: flags.boolean({
		description: 'Output formatted CSV',
		exclusive: ['json'],
	}),
	save: flags.boolean({
		char: 's',
		description: 'Save report to default reports folder on disk',
		exclusive: ['save-to-file-path'],
	}),
	'save-to-file-path': flags.string({
		description: 'Override default file path to save report',
		exclusive: ['save'],
		parse: utils.parsePath,
	}),
	fields: flags.string({
		description: 'Comma separated list of fields to show',
	}),
	'bulk-file-path': flags.string({
		description: 'File path to bulk .csv or .json objects',
		parse: utils.parsePath,
	}),
	help: flags.help({
		char: 'h',
		description: 'Show CLI help',
	}),
	verbose: flags.boolean({
		char: 'v',
		description: 'Show verbose output, which can be helpful for debugging',
	}),
	yes: flags.boolean({
		char: 'y',
		description: 'Automatically respond yes to all confirmation prompts',
	}),
	quiet: flags.boolean({
		char: 'q',
		description: 'Suppress any non-error output to stderr',
	}),
};

BoxCommand.minFlags = _.pick(BoxCommand.flags, [
	'no-color',
	'help',
	'verbose',
	'quiet',
]);

module.exports = BoxCommand;
