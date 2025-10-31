'use strict';

/* eslint-disable promise/catch-or-return,promise/no-callback-in-promise */

const os = require('node:os');
const path = require('node:path');
const BoxCLIError = require('./cli-error');
const utilities = require('./util');

/**
 * Cache interface used by the Node SDK to cache tokens to disk in the user's home directory
 */
class CLITokenCache {
	/**
	 * @constructor
	 * @param {string} environmentName The name of the active CLI environment
	 */
	constructor(environmentName) {
		this.filePath = path.join(
			os.homedir(),
			'.box',
			`${environmentName}_token_cache.json`
		);
	}

	/**
	 * Read tokens from disk
	 * @param {Function} callback The callback to pass resulting token info to
	 * @returns {void}
	 */
	read(callback) {
		utilities
			.readFileAsync(this.filePath, 'utf8')
			.then((json) => JSON.parse(json))
			// If file is not present or not valid JSON, treat that as empty (but available) cache
			.catch(() => ({}))
			.then((tokenInfo) => callback(null, tokenInfo));
	}

	/**
	 * Write tokens to disk
	 * @param {Object} tokenInfo The token object to write
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 */
	write(tokenInfo, callback) {
		let output = JSON.stringify(tokenInfo, null, 4);
		utilities
			.writeFileAsync(this.filePath, output, 'utf8')
			// Pass success or error to the callback
			.then(callback)
			.catch((error) =>
				callback(
					new BoxCLIError('Failed to write to token cache', error)
				)
			);
	}

	/**
	 * Delete the cache file from disk
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 */
	clear(callback) {
		utilities
			.unlinkAsync(this.filePath)
			// Pass success or error to the callback
			.then(callback)
			.catch((error) =>
				callback(new BoxCLIError('Failed to delete token cache', error))
			);
	}

	/**
	 * Write the token to disk, complatible with TS SDK
	 * @param {AccessToken} token The token to write
	 * @returns {Promise<undefined>} A promise resolving to undefined
	 */
	store(token) {
		return new Promise((resolve, reject) => {
			const accquiredAtMS = Date.now();
			const tokenInfo = {
				accessToken: token.accessToken,
				accessTokenTTLMS: token.expiresIn * 1000,
				refreshToken: token.refreshToken,
				acquiredAtMS: accquiredAtMS,
			};
			this.write(tokenInfo, (error) => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			});
		});
	}

	/**
	 * Read the token from disk, compatible with TS SDK
	 * @returns {Promise<undefined | AccessToken>} A promise resolving to the token
	 */
	get() {
		return new Promise((resolve, reject) => {
			this.read((error, tokenInfo) => {
				if (error) {
					reject(error);
				} else {
					resolve(tokenInfo.accessToken ? tokenInfo : undefined);
				}
			});
		});
	}
}

module.exports = CLITokenCache;
