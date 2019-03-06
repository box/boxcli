'use strict';

/* eslint-disable promise/prefer-await-to-callbacks,promise/catch-or-return,promise/prefer-await-to-then,promise/no-callback-in-promise */

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const BoxCLIError = require('./cli-error');

/**
 * Cache interface used by the Node SDK to cache tokens to disk in the user's home directory
 */
class CLITokenCache {

	/**
	 * @constructor
	 * @param {string} environmentName The name of the active CLI environment
	 */
	constructor(environmentName) {

		this.filePath = path.join(os.homedir(), '.box', `${environmentName}_token_cache.json`);
	}

	/**
	 * Read tokens from disk
	 * @param {Function} callback The callback to pass resulting token info to
	 * @returns {void}
	 */
	read(callback) {

		fs.readFile(this.filePath, 'utf8')
			.then(json => JSON.parse(json))
		// If file is not present or not valid JSON, treat that as empty (but available) cache
			.catch(() => ({}))
			.then(tokenInfo => callback(null, tokenInfo));
	}

	/**
	 * Write tokens to disk
	 * @param {Object} tokenInfo The token object to write
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 */
	write(tokenInfo, callback) {

		let output = JSON.stringify(tokenInfo, null, 4);
		fs.writeFile(this.filePath, output, 'utf8')
		// Pass success or error to the callback
			.then(callback)
			.catch(err => callback(new BoxCLIError('Failed to write to token cache', err)));
	}

	/**
	 * Delete the cache file from disk
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 */
	clear(callback) {

		fs.remove(this.filePath)
		// Pass success or error to the callback
			.then(callback)
			.catch(err => callback(new BoxCLIError('Failed to delete token cache', err)));
	}
}

module.exports = CLITokenCache;
