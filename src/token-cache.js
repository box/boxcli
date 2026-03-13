'use strict';

/* eslint-disable promise/catch-or-return,promise/no-callback-in-promise */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const BoxCLIError = require('./cli-error');
const utilities = require('./util');
const DEBUG = require('./debug');

let keytar = null;
let keytarLoadError = null;
try {
	keytar = require('keytar');
} catch (error) {
	// keytar cannot be imported because the library is not provided for this operating system / architecture
	keytarLoadError = error;
}

/**
 * Convert error objects to a stable debug-safe shape.
 *
 * @param {unknown} error A caught error object
 * @returns {Object} A reduced object for DEBUG logging
 */
function getDebugErrorDetails(error) {
	if (!error || typeof error !== 'object') {
		return { message: String(error) };
	}
	return {
		name: error.name || 'Error',
		code: error.code,
		message: error.message || String(error),
		stack: error.stack,
	};
}

/**
 * Cache interface used by the Node SDK to cache tokens to disk in the user's home directory
 * Supports secure storage via keytar with fallback to file system
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
		// Service and account for keytar - includes environment name for multiple environments
		this.keytarService = `boxcli-token-${environmentName}`;
		this.keytarAccount = 'Box';
		this.supportsSecureStorage =
			keytar && ['darwin', 'win32', 'linux'].includes(process.platform);
		if (!this.supportsSecureStorage) {
			DEBUG.init('Token cache secure storage disabled %O', {
				platform: process.platform,
				arch: process.arch,
				node: process.version,
				keytarLoaded: Boolean(keytar),
				keytarLoadError: getDebugErrorDetails(keytarLoadError),
			});
		}
	}

	/**
	 * Read tokens from secure storage with fallback to file system
	 * @param {Function} callback The callback to pass resulting token info to
	 * @returns {void}
	 */
	read(callback) {
		// Try secure storage first if available
		if (this.supportsSecureStorage) {
			keytar
				.getPassword(this.keytarService, this.keytarAccount)
				.then((tokenJson) => {
					if (tokenJson) {
						try {
							const tokenInfo = JSON.parse(tokenJson);
							DEBUG.init(
								'Loaded token from secure storage for environment: %s',
								this.environmentName
							);
							return callback(null, tokenInfo);
						} catch (parseError) {
							DEBUG.init(
								'Failed to parse token from secure storage, falling back to file: %s',
								parseError.message
							);
							// Fall through to file-based storage
						}
					}
					// Token not in secure storage, try file
					DEBUG.init(
						'No token found in secure storage for environment: %s; trying file cache',
						this.environmentName
					);
					return this._readFromFile(callback);
				})
				.catch((error) => {
					DEBUG.init(
						'Failed to read from secure storage, falling back to file: %O',
						getDebugErrorDetails(error)
					);
					// Fall back to file-based storage
					this._readFromFile(callback);
				});
		} else {
			// Secure storage not available, use file
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

		// Try secure storage first if available
		if (this.supportsSecureStorage) {
			keytar
				.setPassword(this.keytarService, this.keytarAccount, output)
				.then(() => {
					DEBUG.init(
						'Stored token in secure storage for environment: %s',
						this.environmentName
					);
					// Clear the file-based cache if it exists (migration scenario)
					if (fs.existsSync(this.filePath)) {
						fs.unlinkSync(this.filePath);
					}
					return;
				})
				.then(() => {
					DEBUG.init(
						'Migrated token from file to secure storage for environment: %s',
						this.environmentName
					);
					return callback();
				})
				.catch((error) => {
					DEBUG.init(
						'Failed to write to secure storage for environment %s, falling back to file: %O',
						this.environmentName,
						getDebugErrorDetails(error)
					);
					if (process.platform === 'linux') {
						DEBUG.init(
							'To enable secure storage on Linux, install libsecret-1-dev package'
						);
					}
					// Fall back to file-based storage
					this._writeToFile(output, callback);
				});
		} else {
			// Secure storage not available, use file
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

		// Try to delete from secure storage
		if (this.supportsSecureStorage) {
			promises.push(
				keytar
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

		// Try to delete from file
		promises.push(
			utilities.unlinkAsync(this.filePath).catch((error) => {
				if (error && error.code === 'ENOENT') {
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
