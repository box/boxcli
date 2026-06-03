'use strict';

const { promisify } = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const DEBUG = require('./debug');
const PLATFORM_DARWIN = 'darwin';
const KEYTAR_PACKAGE = '@github/keytar';
const KEYTAR = 'keytar';
const KEYCHAIN = 'keychain';

/**
 * Ensure the correct platform-specific keytar.node binary exists in
 * build/Release before requiring @github/keytar. This handles the case
 * where the CLI is packed on one OS (e.g. macOS) but runs on another
 * (e.g. Windows): the prebuilds/ folder ships all platforms, and this
 * copies the right one into place on first run.
 */
function ensureKeytarBinary() {
	try {
		const keytarDir = path.dirname(
			require.resolve('@github/keytar/package.json')
		);
		const releaseDir = path.join(keytarDir, 'build', 'Release');
		const targetBinary = path.join(releaseDir, 'keytar.node');

		if (fs.existsSync(targetBinary)) {
			DEBUG.init('keytar binary already exists at %s', targetBinary);
			return;
		}

		const prebuildDir = path.join(
			keytarDir,
			'prebuilds',
			`${process.platform}-${process.arch}`
		);
		const sourceBinary = path.join(prebuildDir, 'keytar.node');

		if (!fs.existsSync(sourceBinary)) {
			DEBUG.init('keytar prebuild not found at %s', sourceBinary);
			return;
		}

		const writableDir = fs.existsSync(releaseDir)
			? releaseDir
			: keytarDir;
		try {
			fs.accessSync(writableDir, fs.constants.W_OK);
		} catch {
			DEBUG.init(
				'No write permission on %s, skipping keytar binary copy',
				writableDir
			);
			return;
		}

		fs.mkdirSync(releaseDir, { recursive: true });
		fs.copyFileSync(sourceBinary, targetBinary);
		DEBUG.init(
			'Copied keytar binary from %s to %s',
			sourceBinary,
			targetBinary
		);
	} catch (error) {
		DEBUG.init(
			'Failed to ensure keytar binary, falling back to prebuilds/: %s',
			error.message
		);
	}
}

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

ensureKeytarBinary();

const { loadedModule: keytarModule, loadError: keytarLoadError } =
	loadOptionalModule(KEYTAR_PACKAGE, process.platform !== PLATFORM_DARWIN);
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
