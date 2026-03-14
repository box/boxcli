'use strict';

const { promisify } = require('node:util');
const DEBUG = require('./debug');

let keytar = null;
let keytarLoadError = null;
try {
	keytar = require('keytar');
} catch (error) {
	keytarLoadError = error;
}

let keychainModule = null;
let keychainLoadError = null;
if (process.platform === 'darwin') {
	try {
		keychainModule = require('keychain');
	} catch (error) {
		keychainLoadError = error;
	}
}

const isDarwin = process.platform === 'darwin';
const isSecurePlatform = ['darwin', 'win32', 'linux'].includes(
	process.platform
);

/**
 * Returns true when error indicates missing keychain/keytar entry.
 *
 * @param {unknown} error The caught error
 * @returns {boolean} Whether this is a "secret not found" error
 */
function isSecretNotFoundError(error) {
	const message = String(error?.message || '').toLowerCase();
	return (
		error?.code === 'ENOENT' ||
		message.includes('not found') ||
		message.includes('password not found') ||
		message.includes('item not found') ||
		message.includes('could not find password')
	);
}

/**
 * Unified secure storage wrapper.
 *
 * On macOS uses the `keychain` npm module (which wraps `/usr/bin/security`).
 * This avoids Keychain ACL prompts because the accessing process is always
 * the system `security` binary, regardless of CLI binary identity changes.
 *
 * On Windows/Linux uses `keytar` (native Keychain/Credential Vault/libsecret).
 */
class SecureStorage {
	constructor() {
		if (isDarwin && keychainModule) {
			this.backend = 'keychain';
			this.available = true;
		} else if (isSecurePlatform && keytar) {
			this.backend = 'keytar';
			this.available = true;
		} else {
			this.backend = null;
			this.available = false;
		}

		DEBUG.init('Secure storage initialized %O', {
			platform: process.platform,
			arch: process.arch,
			backend: this.backend,
			available: this.available,
			keytarLoaded: Boolean(keytar),
			darwinKeychainLoaded: Boolean(keychainModule),
		});

		if (!this.available) {
			if (isDarwin && !keychainModule) {
				DEBUG.init(
					'macOS keychain module not available: %s',
					keychainLoadError?.message || 'unknown'
				);
			}
			if (!keytar) {
				DEBUG.init(
					'keytar module not available: %s',
					keytarLoadError?.message || 'unknown'
				);
			}
		}
	}

	/**
	 * Read a password from secure storage.
	 *
	 * @param {string} service The service name
	 * @param {string} account The account name
	 * @returns {Promise<string|null>} The stored password, or null
	 */
	async getPassword(service, account) {
		if (!this.available) {
			return null;
		}

		if (this.backend === 'keychain') {
			try {
				const getPasswordAsync = promisify(
					keychainModule.getPassword.bind(keychainModule)
				);
				const password = await getPasswordAsync({
					account,
					service,
				});
				return password || null;
			} catch (error) {
				if (isSecretNotFoundError(error)) {
					return null;
				}
				throw error;
			}
		}

		return keytar.getPassword(service, account);
	}

	/**
	 * Write a password to secure storage.
	 *
	 * @param {string} service The service name
	 * @param {string} account The account name
	 * @param {string} password The value to store
	 * @returns {Promise<void>}
	 */
	async setPassword(service, account, password) {
		if (!this.available) {
			throw new Error('Secure storage is not available');
		}

		if (this.backend === 'keychain') {
			const setPasswordAsync = promisify(
				keychainModule.setPassword.bind(keychainModule)
			);
			await setPasswordAsync({ account, service, password });
			return;
		}

		await keytar.setPassword(service, account, password);
	}

	/**
	 * Delete a password from secure storage.
	 *
	 * @param {string} service The service name
	 * @param {string} account The account name
	 * @returns {Promise<boolean>} true if deleted
	 */
	async deletePassword(service, account) {
		if (!this.available) {
			return false;
		}

		if (this.backend === 'keychain') {
			try {
				const deletePasswordAsync = promisify(
					keychainModule.deletePassword.bind(keychainModule)
				);
				await deletePasswordAsync({ account, service });
				return true;
			} catch (error) {
				if (isSecretNotFoundError(error)) {
					return false;
				}
				throw error;
			}
		}

		return keytar.deletePassword(service, account);
	}
}

module.exports = new SecureStorage();
