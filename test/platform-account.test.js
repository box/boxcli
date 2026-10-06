'use strict';

const { assert } = require('chai');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const BoxTSSDK = require('box-node-sdk/sdk-gen');
const { InMemoryTokenStorage } = require('box-node-sdk/sdk-gen/box');
const BoxCLIError = require('../src/cli-error');
const CLITokenCache = require('../src/token-cache');
const {
	isPlatformAccountEnvironment,
	validatePlatformAccountConfig,
	assertPlatformAccountPrincipalIsFixed,
	readPlatformAccountConfig,
	createPlatformAccountAuth,
} = require('../src/platform-account');

const PRIVATE_KEY =
	'-----BEGIN ENCRYPTED PRIVATE KEY-----\nkey\n-----END ENCRYPTED PRIVATE KEY-----\n';

function createConfig({ withPrivateKey = true, withUserId = true } = {}) {
	return {
		boxAppSettings: {
			clientID: 'platform-account-client-id',
			clientSecret: 'platform-account-client-secret',
			appAuth: {
				publicKeyID: 'platform-account-key-id',
				...(withPrivateKey ? { privateKey: PRIVATE_KEY } : {}),
				passphrase: 'platform-account-passphrase',
			},
		},
		...(withUserId ? { userID: '33333' } : {}),
	};
}

describe('Platform Account helpers', function () {
	let tempDirectory;

	beforeEach(function () {
		tempDirectory = fs.mkdtempSync(
			path.join(os.tmpdir(), 'boxcli-platform-account-')
		);
	});

	afterEach(function () {
		fs.rmSync(tempDirectory, { recursive: true, force: true });
	});

	function writeFile(name, content) {
		const filePath = path.join(tempDirectory, name);
		fs.writeFileSync(filePath, content);
		return filePath;
	}

	function createEnvironment(overrides = {}) {
		return {
			authMethod: 'platformAccount',
			boxConfigFilePath: writeFile(
				'config.json',
				JSON.stringify(createConfig())
			),
			hasInLinePrivateKey: true,
			privateKeyPath: null,
			useDefaultAsUser: false,
			cacheTokens: true,
			...overrides,
		};
	}

	describe('isPlatformAccountEnvironment()', function () {
		it('should recognize Platform Account environments only', function () {
			assert.isTrue(
				isPlatformAccountEnvironment({ authMethod: 'platformAccount' })
			);
			assert.isFalse(isPlatformAccountEnvironment({ authMethod: 'jwt' }));
			assert.isFalse(isPlatformAccountEnvironment());
		});
	});

	describe('validatePlatformAccountConfig()', function () {
		it('should accept a complete config without an enterprise ID', function () {
			assert.doesNotThrow(() =>
				validatePlatformAccountConfig(createConfig())
			);
		});

		it('should reject a config without the Platform Account user ID', function () {
			assert.throws(
				() =>
					validatePlatformAccountConfig(
						createConfig({ withUserId: false })
					),
				BoxCLIError,
				'Config object missing key userID'
			);
		});
	});

	describe('assertPlatformAccountPrincipalIsFixed()', function () {
		it('should allow an environment without As-User', function () {
			assert.doesNotThrow(() =>
				assertPlatformAccountPrincipalIsFixed({
					environmentName: 'agent',
					environment: createEnvironment(),
				})
			);
		});

		it('should reject the --as-user flag', function () {
			assert.throws(
				() =>
					assertPlatformAccountPrincipalIsFixed({
						environmentName: 'agent',
						environment: createEnvironment(),
						asUser: '44444',
					}),
				BoxCLIError,
				'The --as-user flag is not supported for Platform Account environments'
			);
		});

		it('should reject a default As-User on the environment', function () {
			assert.throws(
				() =>
					assertPlatformAccountPrincipalIsFixed({
						environmentName: 'agent',
						environment: createEnvironment({
							useDefaultAsUser: true,
							defaultAsUserId: '44444',
						}),
					}),
				BoxCLIError,
				'Environment "agent" has a default As-User set'
			);
		});
	});

	describe('readPlatformAccountConfig()', function () {
		it('should read a config with an inline private key', function () {
			const configObj = readPlatformAccountConfig(createEnvironment());

			assert.deepEqual(configObj, createConfig());
		});

		it('should load the private key from a separate file', function () {
			const environment = createEnvironment({
				boxConfigFilePath: writeFile(
					'config_without_key.json',
					JSON.stringify(createConfig({ withPrivateKey: false }))
				),
				hasInLinePrivateKey: false,
				privateKeyPath: writeFile('private_key.pem', PRIVATE_KEY),
			});

			const configObj = readPlatformAccountConfig(environment);

			assert.equal(
				configObj.boxAppSettings.appAuth.privateKey,
				PRIVATE_KEY
			);
		});

		it('should reject a missing config file', function () {
			const boxConfigFilePath = path.join(tempDirectory, 'missing.json');

			assert.throws(
				() =>
					readPlatformAccountConfig(
						createEnvironment({ boxConfigFilePath })
					),
				BoxCLIError,
				`Could not read Platform Account config file ${boxConfigFilePath}`
			);
		});

		it('should reject a config file changed to miss the Platform Account user ID', function () {
			const boxConfigFilePath = writeFile(
				'config_without_user.json',
				JSON.stringify(createConfig({ withUserId: false }))
			);

			assert.throws(
				() =>
					readPlatformAccountConfig(
						createEnvironment({ boxConfigFilePath })
					),
				BoxCLIError,
				`Invalid Platform Account config file ${boxConfigFilePath}: Config object missing key userID`
			);
		});

		it('should reject a config file without a private key when no private key file is set', function () {
			const boxConfigFilePath = writeFile(
				'config_without_key.json',
				JSON.stringify(createConfig({ withPrivateKey: false }))
			);

			assert.throws(
				() =>
					readPlatformAccountConfig(
						createEnvironment({ boxConfigFilePath })
					),
				BoxCLIError,
				`Invalid Platform Account config file ${boxConfigFilePath}: Config object missing key boxAppSettings.appAuth.privateKey`
			);
		});

		it('should reject a missing private key file', function () {
			const privateKeyPath = path.join(tempDirectory, 'missing.pem');

			assert.throws(
				() =>
					readPlatformAccountConfig(
						createEnvironment({
							hasInLinePrivateKey: false,
							privateKeyPath,
						})
					),
				BoxCLIError,
				`Could not read private key file ${privateKeyPath}`
			);
		});
	});

	describe('createPlatformAccountAuth()', function () {
		it('should build the auth from the config file', function () {
			const auth = createPlatformAccountAuth(
				'agent',
				createEnvironment()
			);

			assert.instanceOf(auth, BoxTSSDK.BoxPlatformAccountAuth);
			assert.equal(auth.config.clientId, 'platform-account-client-id');
			assert.equal(
				auth.config.clientSecret,
				'platform-account-client-secret'
			);
			assert.equal(auth.config.userId, '33333');
			assert.equal(auth.config.jwtKeyId, 'platform-account-key-id');
			assert.equal(auth.config.privateKey, PRIVATE_KEY);
		});

		it('should cache tokens in the CLI token cache of the environment', function () {
			const auth = createPlatformAccountAuth(
				'agent',
				createEnvironment()
			);

			assert.instanceOf(auth.tokenStorage, CLITokenCache);
			assert.equal(auth.tokenStorage.environmentName, 'agent');
		});

		it('should keep tokens in memory when token caching is disabled', function () {
			const auth = createPlatformAccountAuth(
				'agent',
				createEnvironment({ cacheTokens: false })
			);

			assert.instanceOf(auth.tokenStorage, InMemoryTokenStorage);
		});

		it('should validate the config file before building the auth', function () {
			const boxConfigFilePath = writeFile(
				'invalid_config.json',
				JSON.stringify({ userID: '33333' })
			);

			assert.throws(
				() =>
					createPlatformAccountAuth(
						'agent',
						createEnvironment({ boxConfigFilePath })
					),
				BoxCLIError,
				`Invalid Platform Account config file ${boxConfigFilePath}: Config object missing key boxAppSettings.clientID`
			);
		});
	});
});
