'use strict';

/* eslint-disable promise/catch-or-return,promise/no-callback-in-promise */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const BoxCLIError = require('./cli-error');
const utilities = require('./util');
const DEBUG = require('./debug');
const secureStorage = require('./secure-storage');

/**
 * Cache interface used by the Node SDK to cache tokens to disk in the user's home directory
 * Supports secure storage with fallback to file system
 */
class CLITokenCache {
	/**
	 * @constructor
	 * @param {string} environmentName The name of the active CLI environment
	 */
	constructor(environmentName) {
		this.environmentName = environmentName;
		this.filePath = path.join(
			os.homedir(),
			'.box',
			`${environmentName}_token_cache.json`
		);
		this.keytarService = `boxcli-token-${environmentName}`;
		this.keytarAccount = 'Box';
		this.supportsSecureStorage = secureStorage.available;
	}

	/**
	 * Read tokens from secure storage with fallback to file system
	 * @param {Function} callback The callback to pass resulting token info to
	 * @returns {void}
	 */
	read(callback) {
		if (this.supportsSecureStorage) {
			secureStorage
				.getPassword(this.keytarService, this.keytarAccount)
				.then((tokenJson) => {
					if (tokenJson) {
						try {
							const tokenInfo = JSON.parse(tokenJson);
							DEBUG.init(
								'Loaded token from secure storage (%s) for environment: %s',
								secureStorage.backend,
								this.environmentName
							);
							return callback(null, tokenInfo);
						} catch (parseError) {
							DEBUG.init(
								'Failed to parse token from secure storage, falling back to file: %s',
								parseError.message
							);
						}
					}
					DEBUG.init(
						'No token found in secure storage for environment: %s; trying file cache',
						this.environmentName
					);
					return this._readFromFile(callback);
				})
				.catch((error) => {
					DEBUG.init(
						'Failed to read from secure storage (%s), falling back to file: %s',
						secureStorage.backend,
						error?.message || error
					);
					this._readFromFile(callback);
				});
		} else {
			DEBUG.init(
				'Secure storage unavailable for token cache; reading token from file for environment: %s',
				this.environmentName
			);
			this._readFromFile(callback);
		}
	}

	/**
	 * Read tokens from file system
	 * @param {Function} callback The callback to pass resulting token info to
	 * @returns {void}
	 * @private
	 */
	_readFromFile(callback) {
		utilities
			.readFileAsync(this.filePath, 'utf8')
			.then((json) => {
				const tokenInfo = JSON.parse(json);
				if (tokenInfo.accessToken) {
					DEBUG.init(
						'Loaded token from file system for environment: %s (will be migrated to secure storage on next write)',
						this.environmentName
					);
				}
				return tokenInfo;
			})
			// If file is not present or not valid JSON, treat that as empty (but available) cache
			.catch(() => ({}))
			.then((tokenInfo) => callback(null, tokenInfo));
	}

	/**
	 * Write tokens to secure storage with fallback to file system
	 * @param {Object} tokenInfo The token object to write
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 */
	write(tokenInfo, callback) {
		const output = JSON.stringify(tokenInfo, null, 4);

		if (this.supportsSecureStorage) {
			secureStorage
				.setPassword(this.keytarService, this.keytarAccount, output)
				.then(() => {
					DEBUG.init(
						'Stored token in secure storage (%s) for environment: %s',
						secureStorage.backend,
						this.environmentName
					);
					if (fs.existsSync(this.filePath)) {
						fs.unlinkSync(this.filePath);
						DEBUG.init(
							'Migrated token from file to secure storage for environment: %s',
							this.environmentName
						);
					}
					return callback();
				})
				.catch((error) => {
					DEBUG.init(
						'Failed to write to secure storage (%s) for environment %s, falling back to file: %s',
						secureStorage.backend,
						this.environmentName,
						error?.message || error
					);
					if (process.platform === 'linux') {
						DEBUG.init(
							'To enable secure storage on Linux, install libsecret-1-dev package'
						);
					}
					this._writeToFile(output, callback);
				});
		} else {
			DEBUG.init(
				'Secure storage unavailable for token cache; writing token to file for environment: %s',
				this.environmentName
			);
			this._writeToFile(output, callback);
		}
	}

	/**
	 * Write tokens to file system
	 * @param {string} output The JSON string to write
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 * @private
	 */
	_writeToFile(output, callback) {
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
	 * Delete the token from both secure storage and file system
	 * @param {Function} callback The callback to pass results to
	 * @returns {void}
	 */
	clear(callback) {
		const promises = [];

		if (this.supportsSecureStorage) {
			promises.push(
				secureStorage
					.deletePassword(this.keytarService, this.keytarAccount)
					.then((deleted) => {
						if (!deleted) {
							DEBUG.init(
								'No token found in secure storage for environment: %s',
								this.environmentName
							);
						}
						return deleted;
					})
					.catch((error) => {
						const message = String(
							error?.message || ''
						).toLowerCase();
						const isMissingSecretError =
							error?.code === 'ENOENT' ||
							message.includes('not found') ||
							message.includes('password not found') ||
							message.includes('item not found') ||
							message.includes('could not be found');

						if (isMissingSecretError) {
							DEBUG.init(
								'No token found in secure storage for environment: %s',
								this.environmentName
							);
							return null;
						}

						throw new BoxCLIError(
							'Failed to delete token from secure storage',
							error
						);
					})
			);
		}

		promises.push(
			utilities.unlinkAsync(this.filePath).catch((error) => {
				if (error?.code === 'ENOENT') {
					DEBUG.init(
						'No token file found on disk for environment: %s',
						this.environmentName
					);
					return;
				}
				throw new BoxCLIError('Failed to delete token file', error);
			})
		);

		Promise.all(promises)
			.then(() => callback())
			.catch((error) =>
				callback(new BoxCLIError('Failed to delete token cache', error))
			);
	}

	/**
	 * Write the token to storage, compatible with TS SDK
	 * @param {AccessToken} token The token to write
	 * @returns {Promise<undefined>} A promise resolving to undefined
	 */
	store(token) {
		return new Promise((resolve, reject) => {
			const acquiredAtMS = Date.now();
			const tokenInfo = {
				accessToken: token.accessToken,
				accessTokenTTLMS: token.expiresIn * 1000,
				refreshToken: token.refreshToken,
				acquiredAtMS,
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
	 * Read the token from storage, compatible with TS SDK
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
