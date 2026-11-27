'use strict';

/**
 * Test setup, not a test. Mocha loads this file once, before any test file
 * (see `require` in .mocharc.yml). It makes sure tests never read or change
 * the developer's real CLI configuration, keychain entries, or files.
 *
 * 1. Temporary home directory
 *
 *    HOME (USERPROFILE on Windows) is pointed at a new temp directory. Every
 *    path the CLI builds from the home directory, such as `~/.box` (settings,
 *    environments, token caches) and `~/Downloads/Box-Downloads`, now ends up
 *    there instead of in the real home directory.
 *
 *    This has to run before any file from src/ is loaded, because
 *    src/box-command.js reads os.homedir() once, when it is loaded. The check
 *    below throws if that already happened.
 *
 *    Before each test the temp home is emptied and an empty `~/.box` is
 *    created again (the CLI creates that folder at startup and other code
 *    expects it). This way a file written by one test is never seen by the
 *    next one. The whole directory is deleted when the test run ends.
 *
 * 2. In-memory keychain
 *
 *    src/secure-storage.js stores secrets in the system keychain through one
 *    of two npm modules:
 *      - macOS: `keychain` (macOS Keychain)
 *      - Windows and Linux: `@github/keytar` (Windows Credential Manager,
 *        or libsecret on Linux)
 *    Their getPassword/setPassword/deletePassword functions are replaced with
 *    versions that use a plain Map, cleared before each test. If keytar cannot
 *    be loaded (for example on Linux without libsecret), nothing is replaced;
 *    the CLI then stores secrets in files, which are in the temp home anyway.
 *
 *    Why replace these modules and not the methods of secure-storage.js?
 *    Because then the real secure-storage.js code still runs in tests and
 *    only the last step, talking to the OS, is fake:
 *
 *      CLI command -> src/secure-storage.js -> keychain/keytar -> OS keychain
 *                                              ^ replaced here
 *
 *    test/secure-storage.test.js depends on this and does not break it:
 *      - It stubs the `keychain` functions with sinon to check that
 *        secure-storage.js calls them. When sinon restores them after the
 *        test, it puts back our in-memory versions, not the real ones.
 *      - It removes src/secure-storage.js from the require cache and loads it
 *        again. The new copy calls require('keychain') and gets the same,
 *        already replaced module object, because that module stays cached.
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const srcDir = path.resolve(__dirname, '..', '..', 'src') + path.sep;
const loadedSrcModule = Object.keys(require.cache).find((file) =>
	file.startsWith(srcDir)
);
if (loadedSrcModule) {
	throw new Error(
		`${loadedSrcModule} was loaded before the test home directory was set up`
	);
}

const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), 'boxcli-test-home-'));
process.env.HOME = tempHome;
process.env.USERPROFILE = tempHome;
if (os.homedir() !== tempHome) {
	throw new Error(
		`os.homedir() returned ${os.homedir()} instead of the test home directory ${tempHome}`
	);
}
process.on('exit', () => {
	try {
		fs.rmSync(tempHome, { recursive: true, force: true, maxRetries: 3 });
	} catch {
		// A file may still be open (Windows). Leaving the temp dir behind is
		// better than failing a run whose tests all passed.
	}
});

// Empties the temp home, then recreates an empty ~/.box. The CLI creates that
// folder at startup, and code such as the token cache expects it to exist.
function resetTempHome() {
	for (const entry of fs.readdirSync(tempHome)) {
		fs.rmSync(path.join(tempHome, entry), {
			recursive: true,
			force: true,
			maxRetries: 3,
		});
	}
	fs.mkdirSync(path.join(tempHome, '.box'));
}

function loadOptional(packageName) {
	try {
		return require(packageName);
	} catch {
		// Not loadable on this machine. Secure storage is then unavailable and
		// the CLI uses files in the temp home.
		return null;
	}
}

const store = new Map();
const keyOf = (service, account) => `${service}\u0000${account}`;

const keychain =
	process.platform === 'darwin' ? loadOptional('keychain') : null;
const keytar =
	process.platform === 'darwin' ? null : loadOptional('@github/keytar');

// macOS backend: callback API, reports a missing entry as an error.
if (keychain) {
	keychain.getPassword = (opts, fn) => {
		const key = keyOf(opts.service, opts.account);
		if (store.has(key)) {
			fn(null, store.get(key));
		} else {
			fn(new Error('Could not find password'), null);
		}
	};
	keychain.setPassword = (opts, fn) => {
		store.set(keyOf(opts.service, opts.account), opts.password);
		fn(null);
	};
	keychain.deletePassword = (opts, fn) => {
		if (store.delete(keyOf(opts.service, opts.account))) {
			fn(null);
		} else {
			fn(new Error('Could not find password'));
		}
	};
}

// Windows/Linux backend: promise API.
if (keytar) {
	keytar.getPassword = async (service, account) =>
		store.get(keyOf(service, account)) ?? null;
	keytar.setPassword = async (service, account, password) => {
		store.set(keyOf(service, account), password);
	};
	keytar.deletePassword = async (service, account) =>
		store.delete(keyOf(service, account));
}

exports.mochaHooks = {
	beforeEach() {
		store.clear();
		resetTempHome();
	},
};
