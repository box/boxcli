'use strict';

const { promisify } = require('node:util');
const DEBUG = require('./debug');
const PLATFORM_DARWIN = 'darwin';
const KEYTAR = 'keytar';
const KEYCHAIN = 'keychain';

/**
 * Load an optional dependency and capture load errors.
 *
 * @param {string} packageName Package to load
 * @param {boolean} shouldLoad Whether this package should be loaded
 * @returns {{ loadedModule: unknown, loadError: unknown }} Result of loading
 */
function loadOptionalModule(packageName, shouldLoad = true) {
	if (!shouldLoad) {
		return { loadedModule: null, loadError: null };
	}
	try {
		return { loadedModule: require(packageName), loadError: null };
	} catch (error) {
		return { loadedModule: null, loadError: error };
	}
}

const { loadedModule: keytarModule, loadError: keytarLoadError } =
	loadOptionalModule(KEYTAR, process.platform !== PLATFORM_DARWIN);
const { loadedModule: keychainModule, loadError: keychainLoadError } =
	loadOptionalModule(KEYCHAIN, process.platform === PLATFORM_DARWIN);

const isDarwin = process.platform === PLATFORM_DARWIN;
const SUPPORTED_SECURE_STORAGE_PLATFORMS = [PLATFORM_DARWIN, 'win32', 'linux'];
const isSecurePlatform = SUPPORTED_SECURE_STORAGE_PLATFORMS.includes(
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
 * ACL (Access Control List) in Keychain is a per-secret allowlist of apps
 * that can access the item without prompting. Using `keychain` avoids ACL
 * prompts because the accessing process is always the stable system
 * `security` binary, regardless of CLI binary identity/signature changes.
 * If we used `keytar` on macOS, access would come from the current
 * `node`/CLI executable identity; after signed-binary upgrades, macOS can
 * treat it as a different app and show ACL prompts for existing items.
 * That is why this module intentionally does not use `keytar` on macOS.
 *
 * On Windows/Linux uses `keytar` (native Keychain/Credential Vault/libsecret).
 */
class SecureStorage {
	constructor() {
		if (isDarwin && keychainModule) {
			this.backend = KEYCHAIN;
			this.available = true;
		} else if (!isDarwin && isSecurePlatform && keytarModule) {
			this.backend = KEYTAR;
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
			keytarLoaded: Boolean(keytarModule),
			darwinKeychainLoaded: Boolean(keychainModule),
		});

		if (!this.available) {
			if (isDarwin && !keychainModule) {
				DEBUG.init(
					'macOS keychain module not available: %s',
					keychainLoadError?.message || 'unknown'
				);
			}
			if (!isDarwin && !keytarModule) {
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

		if (this.backend === KEYCHAIN) {
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

		return keytarModule.getPassword(service, account);
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

		if (this.backend === KEYCHAIN) {
			const setPasswordAsync = promisify(
				keychainModule.setPassword.bind(keychainModule)
			);
			await setPasswordAsync({ account, service, password });
			return;
		}

		await keytarModule.setPassword(service, account, password);
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

		if (this.backend === KEYCHAIN) {
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

		return keytarModule.deletePassword(service, account);
	}
}

module.exports = new SecureStorage();
