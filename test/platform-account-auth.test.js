'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const BoxTSSDK = require('box-node-sdk/sdk-gen');
const BoxCommand = require('../src/box-command');
const { TEST_API_ROOT } = require('./helpers/test-helper');

const CLIENT_ID = 'platform-account-client-id';
const CLIENT_SECRET = 'platform-account-client-secret';
const PUBLIC_KEY_ID = 'platform-account-key-id';
const PASSPHRASE = 'platform-account-passphrase';
const USER_ID = '33333';
const ENTERPRISE_ID = '11111';
const ACCESS_TOKEN = 'platform-account-access-token';
const ENVIRONMENT_NAME = 'platform-account-env';
const FIXED_PRINCIPAL_MESSAGE =
	"is not supported for Platform Account environments. Commands always run as the Platform Account from the environment's config file.";

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
		cipher: 'aes-256-cbc',
		passphrase: PASSPHRASE,
	},
});

function createConfig({ withPrivateKey = true, withUserId = true } = {}) {
	return {
		boxAppSettings: {
			clientID: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			appAuth: {
				publicKeyID: PUBLIC_KEY_ID,
				...(withPrivateKey ? { privateKey } : {}),
				passphrase: PASSPHRASE,
			},
		},
		enterpriseID: ENTERPRISE_ID,
		...(withUserId ? { userID: USER_ID } : {}),
	};
}

function writeTempFile(directory, name, content) {
	const filePath = path.join(directory, name);
	fs.writeFileSync(filePath, content);
	return filePath;
}

function decodeBase64Url(segment) {
	return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
}

/**
 * Assert the token request is a Platform Account JWT bearer grant signed with
 * the configured private key for the configured Platform Account.
 *
 * @param {Object} body Parsed form body of the token request
 * @returns {boolean} True, so nock accepts the request
 */
function assertPlatformAccountTokenRequest(body) {
	assert.equal(
		body.grant_type,
		'urn:ietf:params:oauth:grant-type:jwt-bearer'
	);
	assert.equal(body.client_id, CLIENT_ID);
	assert.equal(body.client_secret, CLIENT_SECRET);

	const header = decodeBase64Url(body.assertion.split('.')[0]);
	assert.equal(header.alg, 'RS256');
	assert.equal(header.typ, 'platform-account+jwt');

	const claims = jwt.verify(body.assertion, publicKey, {
		algorithms: ['RS256'],
		audience: 'https://api.box.com/oauth2/token',
		issuer: CLIENT_ID,
		subject: USER_ID,
	});
	assert.equal(claims.box_sub_type, 'user');
	assert.isString(claims.jti);
	assert.isAbove(claims.exp, claims.iat);
	return true;
}

function mockPlatformAccountTokenRequest(api) {
	return api
		.post('/oauth2/token', assertPlatformAccountTokenRequest)
		.reply(200, {
			access_token: ACCESS_TOKEN,
			expires_in: 3600,
			token_type: 'bearer',
			restricted_to: [],
		});
}

describe('Platform Account authentication', function () {
	let tempDirectory;
	let configFilePath;
	let environments;

	function useEnvironment(overrides = {}) {
		environments = {
			default: ENVIRONMENT_NAME,
			environments: {
				[ENVIRONMENT_NAME]: {
					name: ENVIRONMENT_NAME,
					authMethod: 'platformAccount',
					clientId: CLIENT_ID,
					enterpriseId: ENTERPRISE_ID,
					userId: USER_ID,
					boxConfigFilePath: configFilePath,
					hasInLinePrivateKey: true,
					privateKeyPath: null,
					defaultAsUserId: null,
					useDefaultAsUser: false,
					cacheTokens: false,
					...overrides,
				},
			},
		};
	}

	function platformAccountTest() {
		return test.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
			stub.callsFake(() => Promise.resolve(environments))
		);
	}

	before(function () {
		tempDirectory = fs.mkdtempSync(
			path.join(os.tmpdir(), 'boxcli-platform-account-')
		);
		configFilePath = writeTempFile(
			tempDirectory,
			'platform_account_config.json',
			JSON.stringify(createConfig())
		);
	});

	after(function () {
		fs.rmSync(tempDirectory, { recursive: true, force: true });
	});

	beforeEach(function () {
		useEnvironment();
	});

	describe('legacy SDK client commands', function () {
		platformAccountTest()
			.nock(TEST_API_ROOT, (api) =>
				mockPlatformAccountTokenRequest(api)
					.get('/2.0/users/me')
					.matchHeader('Authorization', `Bearer ${ACCESS_TOKEN}`)
					.reply(200, { type: 'user', id: USER_ID })
			)
			.stdout()
			.command(['users:get', 'me', '--json'])
			.it(
				'should authenticate as the Platform Account from the config file',
				(context) => {
					assert.equal(JSON.parse(context.stdout).id, USER_ID);
				}
			);

		platformAccountTest()
			.do(() => {
				const keyPath = writeTempFile(
					tempDirectory,
					'private_key.pem',
					privateKey
				);
				const configWithoutKeyPath = writeTempFile(
					tempDirectory,
					'platform_account_config_without_key.json',
					JSON.stringify(createConfig({ withPrivateKey: false }))
				);
				useEnvironment({
					boxConfigFilePath: configWithoutKeyPath,
					hasInLinePrivateKey: false,
					privateKeyPath: keyPath,
				});
			})
			.nock(TEST_API_ROOT, (api) =>
				mockPlatformAccountTokenRequest(api)
					.get('/2.0/users/me')
					.matchHeader('Authorization', `Bearer ${ACCESS_TOKEN}`)
					.reply(200, { type: 'user', id: USER_ID })
			)
			.stdout()
			.command(['users:get', 'me', '--json'])
			.it(
				'should sign with the private key from the environment private key path',
				(context) => {
					assert.equal(JSON.parse(context.stdout).id, USER_ID);
				}
			);
	});

	describe('TypeScript SDK client commands', function () {
		platformAccountTest()
			.nock(TEST_API_ROOT, (api) =>
				mockPlatformAccountTokenRequest(api)
					.get('/2.0/hubs/12345')
					.matchHeader('Authorization', `Bearer ${ACCESS_TOKEN}`)
					.reply(200, { type: 'hubs', id: '12345' })
			)
			.stdout()
			.command(['hubs:get', '12345', '--json'])
			.it(
				'should authenticate as the Platform Account from the config file',
				(context) => {
					assert.equal(JSON.parse(context.stdout).id, '12345');
				}
			);
	});

	describe('--token flag', function () {
		platformAccountTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/users/me')
					.matchHeader('Authorization', 'Bearer explicit-token')
					.reply(200, { type: 'user', id: '44444' })
			)
			.stdout()
			.command(['users:get', 'me', '--json', '--token=explicit-token'])
			.it(
				'should take precedence over the Platform Account environment',
				(context) => {
					assert.equal(JSON.parse(context.stdout).id, '44444');
				}
			);
	});

	describe('fixed principal guardrails', function () {
		platformAccountTest()
			.stderr()
			.command(['users:get', 'me', '--as-user=44444', '--no-color'])
			.it('should reject the --as-user flag', (context) => {
				assert.include(
					context.stderr,
					`The --as-user flag ${FIXED_PRINCIPAL_MESSAGE}`
				);
			});

		platformAccountTest()
			.do(() =>
				useEnvironment({
					useDefaultAsUser: true,
					defaultAsUserId: '44444',
				})
			)
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should reject an environment with a default As-User',
				(context) => {
					assert.include(
						context.stderr,
						`Environment "${ENVIRONMENT_NAME}" has a default As-User set, which is not supported for Platform Account environments. Run "box configure:environments:switch-user --default" to remove it.`
					);
				}
			);
	});

	describe('configuration errors', function () {
		platformAccountTest()
			.do(() => {
				const invalidConfigPath = writeTempFile(
					tempDirectory,
					'platform_account_config_without_user.json',
					JSON.stringify(createConfig({ withUserId: false }))
				);
				useEnvironment({ boxConfigFilePath: invalidConfigPath });
			})
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should report which value is missing from the Platform Account config file',
				(context) => {
					assert.include(
						context.stderr,
						'Invalid Platform Account config file'
					);
					assert.include(
						context.stderr,
						'Config object missing key userID'
					);
				}
			);

		platformAccountTest()
			.do(() =>
				useEnvironment({
					boxConfigFilePath: path.join(tempDirectory, 'missing.json'),
				})
			)
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it('should report a missing config file', (context) => {
				assert.include(
					context.stderr,
					'Could not read Platform Account config file'
				);
			});
	});

	describe('token request errors', function () {
		function mockRejectedTokenRequest(api) {
			return api.post('/oauth2/token').reply(400, {
				error: 'invalid_grant',
				error_description: 'Platform Account not found',
			});
		}

		platformAccountTest()
			.nock(TEST_API_ROOT, mockRejectedTokenRequest)
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should report the OAuth error from a legacy client command',
				(context) => {
					assert.include(
						context.stderr,
						'Unexpected API Response [400] invalid_grant - Platform Account not found'
					);
				}
			);

		platformAccountTest()
			.nock(TEST_API_ROOT, mockRejectedTokenRequest)
			.stderr()
			.command(['tokens:get', '--no-color'])
			.it(
				'should report the OAuth error from a TS client command',
				(context) => {
					assert.include(
						context.stderr,
						'Unexpected API Response [400] invalid_grant - Platform Account not found'
					);
				}
			);
	});

	describe('proxy settings', function () {
		const PROXY = Object.freeze({
			url: 'http://proxy.example.com:8080',
			username: 'proxy-user',
			password: 'proxy-password',
		});
		let refreshTokenStub;

		function proxyTest() {
			return platformAccountTest()
				.stub(BoxCommand.prototype, '_loadSettings', (stub) =>
					stub.resolves({ enableProxy: true, proxy: PROXY })
				)
				.do(() => {
					refreshTokenStub = sinon
						.stub(
							BoxTSSDK.BoxPlatformAccountAuth.prototype,
							'refreshToken'
						)
						.rejects(new Error('token request captured'));
				})
				.finally(() => {
					refreshTokenStub?.restore();
					refreshTokenStub = undefined;
				});
		}

		function getTokenRequestNetworkSession() {
			assert.isTrue(refreshTokenStub.calledOnce);
			return refreshTokenStub.firstCall.args[0];
		}

		proxyTest()
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should send legacy client token requests through the configured proxy',
				() => {
					assert.deepEqual(
						getTokenRequestNetworkSession().proxyConfig,
						PROXY
					);
				}
			);

		proxyTest()
			.stderr()
			.command(['tokens:get', '--no-color'])
			.it(
				'should send TS client token requests through the configured proxy',
				() => {
					assert.deepEqual(
						getTokenRequestNetworkSession().proxyConfig,
						PROXY
					);
				}
			);
	});

	describe('tokens commands', function () {
		platformAccountTest()
			.nock(TEST_API_ROOT, (api) => mockPlatformAccountTokenRequest(api))
			.stdout()
			.command(['tokens:get'])
			.it(
				'tokens:get should output a new Platform Account token',
				(context) => {
					assert.equal(context.stdout, `${ACCESS_TOKEN}${os.EOL}`);
				}
			);

		platformAccountTest()
			.stderr()
			.command(['tokens:get', '--user-id=44444', '--no-color'])
			.it('tokens:get should reject --user-id', (context) => {
				assert.include(
					context.stderr,
					`The --user-id flag ${FIXED_PRINCIPAL_MESSAGE}`
				);
			});

		platformAccountTest()
			.stderr()
			.command(['tokens:exchange', 'item_preview', '--no-color'])
			.it('tokens:exchange should reject downscoping', (context) => {
				assert.include(
					context.stderr,
					'Token exchange and downscoping are not supported for Platform Account environments'
				);
			});

		platformAccountTest()
			.stderr()
			.command([
				'tokens:exchange',
				'item_preview',
				'--user-id=44444',
				'--no-color',
			])
			.it('tokens:exchange should reject --user-id', (context) => {
				assert.include(
					context.stderr,
					'Token exchange and downscoping are not supported for Platform Account environments'
				);
			});
	});
});
