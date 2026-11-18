'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const inquirer = require('inquirer');
const nodeHttp = require('node:http');
const { test } = require('@oclif/test');
const BoxCommand = require('../../src/box-command');
const {
	assertValidOAuthCode,
	getTokenInfoByAuthCode,
} = require('../../src/login-helper');
const OAuthLoginCommand = require('../../src/commands/login');
const CLITokenCache = require('../../src/token-cache');
const BoxCLIError = require('../../src/cli-error');
const { createHash } = require('node:crypto');

// Send a single callback request once the test decides flow timing.
// Keeping this as a tiny helper makes callback assertions easier to read.
function sendCallback(url) {
	return new Promise((resolve, reject) => {
		const request = nodeHttp.get(url, (response) => {
			response.resume();
			resolve(response.statusCode);
		});
		request.on('error', reject);
	});
}

// Wait until loopback port accepts connections before sending callback.
// HTTP status does not matter here; a non-ECONNREFUSED response means server is ready.
async function waitForLoopbackPort(port, maxAttempts = 20, delayMs = 5) {
	for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
		try {
			await new Promise((resolve, reject) => {
				const request = nodeHttp.get(
					`http://localhost:${port}/`,
					(response) => {
						response.resume();
						resolve();
					}
				);
				request.on('error', reject);
			});
			return;
		} catch {
			await new Promise((resolve) => setTimeout(resolve, delayMs));
		}
	}

	throw new Error(
		`Local callback server on port ${port} did not become ready in time`
	);
}

async function findFreePort(ports) {
	for (const port of ports) {
		const isFree = await new Promise((resolve) => {
			const server = nodeHttp.createServer();
			server.once('error', () => resolve(false));
			server.listen(port, 'localhost', () =>
				server.close(() => resolve(true))
			);
		});
		if (isFree) {
			return port;
		}
	}

	throw new Error(`None of the ports ${ports.join(', ')} is free`);
}

describe('Login', function () {
	let sandbox;
	const DEFAULT_CLIENT_ID = 'udz8zp4yue87uk9dzq4xk425kkwvqvh1';
	const DEFAULT_CLIENT_SECRET = 'iZ1MbvC3ZaF25nbJli7IsKdRHAxfu3fn';

	beforeEach(function () {
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
		OAuthLoginCommand._test.resetOAuthCallbackTimeoutMs();
		OAuthLoginCommand._test.resetOpenAuthorizeInBrowser();
		sandbox.restore();
	});

	describe('getTokenInfoByAuthCode', function () {
		it('should exchange auth code with optional code_verifier and redirect_uri', async function () {
			const tokenInfo = {
				accessToken: 'test-access-token',
				refreshToken: 'test-refresh-token',
				accessTokenTTLMS: 3_600_000,
				acquiredAtMS: 1,
			};
			const getTokensStub = sandbox.stub().resolves(tokenInfo);
			const sdk = {
				tokenManager: {
					getTokens: getTokensStub,
				},
			};

			const result = await getTokenInfoByAuthCode(
				sdk,
				'auth-code',
				'http://localhost:3000/callback',
				'pkce-verifier'
			);

			assert.strictEqual(result, tokenInfo);
			assert.isTrue(getTokensStub.calledOnce);
			assert.deepEqual(getTokensStub.firstCall.args[0], {
				grant_type: 'authorization_code',
				code: 'auth-code',
				redirect_uri: 'http://localhost:3000/callback',
				code_verifier: 'pkce-verifier',
			});
			assert.isNull(getTokensStub.firstCall.args[1]);
		});

		it('should exchange auth code without code_verifier', async function () {
			const tokenInfo = {
				accessToken: 'test-access-token',
				refreshToken: 'test-refresh-token',
				accessTokenTTLMS: 3_600_000,
				acquiredAtMS: 1,
			};
			const getTokensStub = sandbox.stub().resolves(tokenInfo);
			const sdk = {
				tokenManager: {
					getTokens: getTokensStub,
				},
			};

			const result = await getTokenInfoByAuthCode(
				sdk,
				'auth-code',
				'http://localhost:3000/callback'
			);

			assert.strictEqual(result, tokenInfo);
			assert.isTrue(getTokensStub.calledOnce);
			assert.deepEqual(getTokensStub.firstCall.args[0], {
				grant_type: 'authorization_code',
				code: 'auth-code',
				redirect_uri: 'http://localhost:3000/callback',
			});
			assert.isNull(getTokensStub.firstCall.args[1]);
		});

		it('should throw when token manager is unavailable', async function () {
			try {
				await getTokenInfoByAuthCode(
					{},
					'auth-code',
					'http://localhost:3000/callback',
					'pkce-verifier'
				);
				assert.fail('Expected getTokenInfoByAuthCode to throw');
			} catch (error) {
				assert.include(
					error.message,
					'OAuth token manager is unavailable'
				);
			}
		});
	});

	describe('assertValidOAuthCode', function () {
		it('should throw when code is undefined, null, or empty', function () {
			for (const invalidCode of [undefined, null, '']) {
				assert.throws(() => {
					assertValidOAuthCode(invalidCode);
				}, /Invalid OAuth code received in callback/u);
			}
		});

		it('should not throw for a non-empty string code', function () {
			assert.doesNotThrow(() => {
				assertValidOAuthCode('valid-code');
			});
		});
	});

	describe('login command flags', function () {
		it('should expose --default-box-app flag', function () {
			assert.property(OAuthLoginCommand.flags, 'default-box-app');
		});

		it('should expose --platform-app flag', function () {
			assert.property(OAuthLoginCommand.flags, 'platform-app');
		});

		it('should mark --platform-app and --default-box-app as mutually exclusive', function () {
			assert.include(
				OAuthLoginCommand.flags['platform-app'].exclusive,
				'default-box-app'
			);
		});

		it('should expose --public-client flag, exclusive with the other app flags', function () {
			assert.property(OAuthLoginCommand.flags, 'public-client');
			assert.sameMembers(
				OAuthLoginCommand.flags['public-client'].exclusive,
				['default-box-app', 'platform-app', 'reauthorize']
			);
			assert.include(
				OAuthLoginCommand.flags['default-box-app'].exclusive,
				'public-client'
			);
			assert.include(
				OAuthLoginCommand.flags['platform-app'].exclusive,
				'public-client'
			);
		});
	});

	describe('public client with --reauthorize', function () {
		test.stub(BoxCommand.prototype, '_loadSettings', (stub) =>
			stub.resolves({})
		)
			.stderr()
			.command([
				'login',
				'--reauthorize',
				'-n',
				'my-app',
				'--public-client',
			])
			.it(
				'should reject --public-client combined with --reauthorize',
				(ctx) => {
					assert.include(ctx.stderr, '--public-client');
					assert.include(ctx.stderr, '--reauthorize');
					assert.include(ctx.stderr, 'cannot also be provided');
				}
			);
	});

	describe('getLoginErrorMessage', function () {
		const { getLoginErrorMessage } = OAuthLoginCommand._test;

		it('should show the error description from a wrapped API error', function () {
			const error = new BoxCLIError(
				'Failed to exchange auth code for tokens.',
				Object.assign(new Error('Request failed'), {
					responseInfo: {
						statusCode: 400,
						body: { error_description: 'Invalid redirect URI' },
					},
				})
			);

			assert.equal(getLoginErrorMessage(error), 'Invalid redirect URI');
		});

		it('should add the cause to the message when the wrapped error is not an API error', function () {
			const error = new BoxCLIError(
				'Failed to exchange auth code for tokens.',
				new Error('No code verifier found for the given state.')
			);

			assert.equal(
				getLoginErrorMessage(error),
				'Failed to exchange auth code for tokens. No code verifier found for the given state.'
			);
		});

		it('should show the message of an error without a cause', function () {
			assert.equal(
				getLoginErrorMessage(new Error('connect ECONNREFUSED')),
				'connect ECONNREFUSED'
			);
		});
	});

	describe('public client prompts', function () {
		it('should prompt for a public client ID only when user enters "3"', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: '3' })
				.onSecondCall()
				.resolves({ clientId: ' public-client-id ' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(promptStub.callCount, 2);
			assert.strictEqual(
				promptStub.secondCall.args[0][0].message,
				'Enter the Client ID of the Public Client App:'
			);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				publicClient: true,
				clientId: 'public-client-id',
			});
		});

		it('should ask again until the Client ID is not empty', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ clientId: '' })
				.onSecondCall()
				.resolves({ clientId: '   ' })
				.onThirdCall()
				.resolves({ clientId: 'public-client-id' });

			const result =
				await OAuthLoginCommand._test.promptForPublicClientCredentials({
					prompt: promptStub,
				});

			assert.strictEqual(promptStub.callCount, 3);
			assert.strictEqual(result.clientId, 'public-client-id');
		});

		it('should not prompt for a client secret', async function () {
			const promptStub = sandbox
				.stub()
				.resolves({ clientId: 'public-client-id' });

			const result =
				await OAuthLoginCommand._test.promptForPublicClientCredentials({
					prompt: promptStub,
				});

			assert.isTrue(promptStub.calledOnce);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				publicClient: true,
				clientId: 'public-client-id',
			});
		});
	});

	describe('promptForAuthMethod', function () {
		it('should use default box app when user enters "1"', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: '1' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.isTrue(promptStub.calledOnce);
			assert.deepEqual(result, {
				useDefaultBoxApp: true,
				clientId: DEFAULT_CLIENT_ID,
				clientSecret: DEFAULT_CLIENT_SECRET,
			});
		});

		it('should prompt for client ID and secret when user enters "2"', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: '2' })
				.onSecondCall()
				.resolves({ clientId: 'custom-client-id' })
				.onThirdCall()
				.resolves({ clientSecret: 'custom-client-secret' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(promptStub.callCount, 3);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				clientId: 'custom-client-id',
				clientSecret: 'custom-client-secret',
			});
		});

		it('should treat input between 16 and 99 characters as client ID and prompt for secret', async function () {
			const clientId32 = 'abcdefghijklmnopqrstuvwxyz123456';
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: clientId32 })
				.onSecondCall()
				.resolves({ clientSecret: 'my-secret' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(promptStub.callCount, 2);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				clientId: clientId32,
				clientSecret: 'my-secret',
			});
		});

		it('should treat input with surrounding whitespace as client ID when trimmed length is valid', async function () {
			const clientId32 = 'abcdefghijklmnopqrstuvwxyz123456';
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: `  ${clientId32}  ` })
				.onSecondCall()
				.resolves({ clientSecret: 'my-secret' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(promptStub.callCount, 2);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				clientId: clientId32,
				clientSecret: 'my-secret',
			});
		});

		it('should repeat prompt on invalid input then accept valid choice', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: 'invalid' })
				.onSecondCall()
				.resolves({ choice: '' })
				.onCall(2)
				.resolves({ choice: '1' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(promptStub.callCount, 3);
			assert.deepEqual(result, {
				useDefaultBoxApp: true,
				clientId: DEFAULT_CLIENT_ID,
				clientSecret: DEFAULT_CLIENT_SECRET,
			});
		});

		it('should verify prompt message contains expected text', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: '1' });

			await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			const promptConfig = promptStub.firstCall.args[0][0];
			assert.include(
				promptConfig.message,
				'How would you like to authenticate?'
			);
			assert.include(
				promptConfig.message,
				'[1] Log-in as a Box user (OAuth)'
			);
			assert.include(promptConfig.message, '[2] Use a Box Platform App');
			assert.include(
				promptConfig.message,
				'[3] Use a Box Platform Public Client App (PKCE, no client secret)'
			);
			assert.include(promptConfig.message, '[q] Quit');
			assert.include(promptConfig.message, 'Enter 1, 2, 3, or q:');
		});

		it('should return null when user enters q to quit', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: 'q' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(result, null);
		});

		it('should return null when user enters Q to quit', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: 'Q' });

			const result = await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			assert.strictEqual(result, null);
		});

		it('should use correct messages when prompting for Client ID and Secret', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ choice: '2' })
				.onSecondCall()
				.resolves({ clientId: 'test-id' })
				.onThirdCall()
				.resolves({ clientSecret: 'test-secret' });

			await OAuthLoginCommand._test.promptForAuthMethod({
				prompt: promptStub,
			});

			const clientIdPromptConfig = promptStub.secondCall.args[0][0];
			assert.strictEqual(
				clientIdPromptConfig.message,
				'Enter the Client ID:'
			);

			const clientSecretPromptConfig = promptStub.thirdCall.args[0][0];
			assert.strictEqual(
				clientSecretPromptConfig.message,
				'Enter the Client Secret:'
			);
		});
	});

	describe('promptForCustomAppCredentials', function () {
		it('should prompt for both client ID and secret when no client ID is given', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ clientId: ' my-client-id ' })
				.onSecondCall()
				.resolves({ clientSecret: 'my-secret' });

			const result =
				await OAuthLoginCommand._test.promptForPlatformAppCredentials({
					prompt: promptStub,
				});

			assert.strictEqual(promptStub.callCount, 2);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				clientId: 'my-client-id',
				clientSecret: 'my-secret',
			});
		});

		it('should only prompt for secret when client ID is provided', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ clientSecret: 'my-secret' });

			const result =
				await OAuthLoginCommand._test.promptForPlatformAppCredentials(
					{ prompt: promptStub },
					'pre-filled-client-id'
				);

			assert.isTrue(promptStub.calledOnce);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				clientId: 'pre-filled-client-id',
				clientSecret: 'my-secret',
			});
		});

		it('should use correct prompt messages', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ clientId: 'cid' })
				.onSecondCall()
				.resolves({ clientSecret: 'cs' });

			await OAuthLoginCommand._test.promptForPlatformAppCredentials({
				prompt: promptStub,
			});

			assert.strictEqual(
				promptStub.firstCall.args[0][0].message,
				'Enter the Client ID:'
			);
			assert.strictEqual(
				promptStub.secondCall.args[0][0].message,
				'Enter the Client Secret:'
			);
		});
	});

	describe('reauthorize with non-existent environment', function () {
		let getEnvironmentsStub;

		beforeEach(function () {
			getEnvironmentsStub = sandbox.stub(
				BoxCommand.prototype,
				'getEnvironments'
			);
		});

		test.do(() => {
			getEnvironmentsStub.resolves({ default: '', environments: {} });
		})
			.stderr()
			.command(['login', '--reauthorize', '-n', 'nonexistent'])
			.it(
				'should show error when specified env does not exist and no current env',
				(ctx) => {
					assert.include(
						ctx.stderr,
						'The "nonexistent" environment does not exist'
					);
				}
			);

		test.do(() => {
			getEnvironmentsStub.resolves({
				default: 'jwt-env',
				environments: {
					'jwt-env': { authMethod: 'jwt', clientId: 'cid' },
				},
			});
		})
			.stderr()
			.command(['login', '--reauthorize', '-n', 'nonexistent'])
			.it(
				'should show error when specified env does not exist and current env is not OAuth',
				(ctx) => {
					assert.include(
						ctx.stderr,
						'The "nonexistent" environment does not exist'
					);
				}
			);

		test.do(() => {
			getEnvironmentsStub.resolves({
				default: 'my-oauth',
				environments: {
					'my-oauth': {
						authMethod: 'oauth20',
						clientId: DEFAULT_CLIENT_ID,
						clientSecret: DEFAULT_CLIENT_SECRET,
					},
				},
			});
		})
			.stderr()
			.command(['login', '--reauthorize', '-n', 'nonexistent'])
			.it(
				'should show error when specified env does not exist and name is not oauth (even if current is OAuth)',
				(ctx) => {
					assert.include(
						ctx.stderr,
						'The "nonexistent" environment does not exist'
					);
				}
			);

		let promptStub;
		const reauthorizeWithCodeArgs = [
			'login',
			'--reauthorize',
			'-n',
			'oauth',
			'--default-box-app',
			'--code',
			'--port',
		];
		test.do(async () => {
			// .command() reads its args when the test runs, so the port can be appended here.
			reauthorizeWithCodeArgs[7] = String(
				await findFreePort(
					OAuthLoginCommand._test.SUPPORTED_DEFAULT_APP_PORTS
				)
			);
			promptStub = sandbox.stub(inquirer, 'prompt').resolves({
				code: 'test-code',
				state: 'test-state',
			});
			getEnvironmentsStub.resolves({
				default: 'my-oauth',
				environments: {
					'my-oauth': {
						authMethod: 'oauth20',
						clientId: DEFAULT_CLIENT_ID,
						clientSecret: DEFAULT_CLIENT_SECRET,
					},
				},
			});
		})
			.stderr()
			.command(reauthorizeWithCodeArgs)
			.it(
				'should use current OAuth env when name is oauth and that env does not exist',
				(ctx) => {
					assert.notInclude(
						ctx.stderr,
						'The "oauth" environment does not exist'
					);
					assert.include(ctx.stderr, 'Please open');
					assert.isTrue(promptStub.calledOnce);
				}
			);
	});

	describe('oauth callback command behavior', function () {
		let unsolicitedStatusPromise;
		test.do(() => {
			OAuthLoginCommand._test.setOpenAuthorizeInBrowser(() => {});
			OAuthLoginCommand._test.setOAuthCallbackTimeoutMs(50);
			unsolicitedStatusPromise = (async () => {
				await waitForLoopbackPort(Number.parseInt('19093', 10));
				return sendCallback(
					'http://localhost:19093/callback?state=wrong-state&code=unsolicited'
				);
			})();
		})
			.stub(BoxCommand.prototype, '_loadSettings', (stub) =>
				stub.resolves({})
			)
			.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
				stub.resolves({ default: '', environments: {} })
			)
			.stub(inquirer, 'prompt', (stub) =>
				stub
					.onFirstCall()
					.resolves({ clientId: 'cid' })
					.onSecondCall()
					.resolves({ clientSecret: 'secret' })
			)
			.stderr()
			.command(['login', '--platform-app', '--port', '19093'])
			.it(
				'should fail login when callback state is invalid',
				async (ctx) => {
					const statusCode = await unsolicitedStatusPromise;
					assert.strictEqual(statusCode, 500);
					assert.include(
						ctx.stderr,
						'Login failed: Invalid OAuth state received in callback'
					);
					assert.notInclude(
						ctx.stderr,
						'Login timed out waiting for OAuth callback'
					);
					OAuthLoginCommand._test.resetOpenAuthorizeInBrowser();
					OAuthLoginCommand._test.resetOAuthCallbackTimeoutMs();
				}
			);

		test.do(() => {
			OAuthLoginCommand._test.setOpenAuthorizeInBrowser(() => {});
			OAuthLoginCommand._test.setOAuthCallbackTimeoutMs(50);
		})
			.stub(BoxCommand.prototype, '_loadSettings', (stub) =>
				stub.resolves({})
			)
			.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
				stub.resolves({ default: '', environments: {} })
			)
			.stub(inquirer, 'prompt', (stub) =>
				stub
					.onFirstCall()
					.resolves({ clientId: 'cid' })
					.onSecondCall()
					.resolves({ clientSecret: 'secret' })
			)
			.stderr()
			.command(['login', '--platform-app', '--port', '19094'])
			.it('should time out when no callback is received', (ctx) => {
				assert.include(
					ctx.stderr,
					'Login timed out waiting for OAuth callback'
				);
				OAuthLoginCommand._test.resetOpenAuthorizeInBrowser();
				OAuthLoginCommand._test.resetOAuthCallbackTimeoutMs();
			});

		let busyServer;
		// Use a high random port to reduce clashes with common local services.
		const busyPort = 30_000 + Math.floor(Math.random() * 10_000);
		test.do(async () => {
			OAuthLoginCommand._test.setOpenAuthorizeInBrowser(() => {});
			OAuthLoginCommand._test.setOAuthCallbackTimeoutMs(50);
			busyServer = nodeHttp.createServer();
			await new Promise((resolve, reject) => {
				busyServer.once('error', reject);
				busyServer.listen(busyPort, 'localhost', resolve);
			});
		})
			.stub(BoxCommand.prototype, '_loadSettings', (stub) =>
				stub.resolves({})
			)
			.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
				stub.resolves({ default: '', environments: {} })
			)
			.stub(inquirer, 'prompt', (stub) =>
				stub
					.onFirstCall()
					.resolves({ clientId: 'cid' })
					.onSecondCall()
					.resolves({ clientSecret: 'secret' })
			)
			.stderr()
			.command(['login', '--platform-app', '--port', String(busyPort)])
			.it(
				'should fail with a friendly message when callback port is in use',
				async (ctx) => {
					try {
						assert.include(
							ctx.stderr,
							`Port ${busyPort} is already in use. Please close the application using this port or use --port to specify a different port.`
						);
					} finally {
						OAuthLoginCommand._test.resetOpenAuthorizeInBrowser();
						OAuthLoginCommand._test.resetOAuthCallbackTimeoutMs();
						if (busyServer) {
							await new Promise((resolve) =>
								busyServer.close(resolve)
							);
							busyServer = null;
						}
					}
				}
			);
	});

	describe('public client login', function () {
		const PUBLIC_CLIENT_ID = 'public-client-id';
		let port;
		let authorizeUrl;
		let callbackStatusPromise;
		let savedEnvironments;
		let cachedTokenInfo;

		// .command() reads its args when the test runs, so the port can be set here.
		// Pass a failedTokenResponse to make the token endpoint reject the authorization code.
		function publicClientLoginTest(environments, args, failedTokenResponse) {
			return test
				.do(async () => {
					port = await findFreePort([19_095, 19_096, 19_097, 19_098]);
					args[args.length - 1] = String(port);
					savedEnvironments = null;
					cachedTokenInfo = {};
					callbackStatusPromise = null;
					OAuthLoginCommand._test.setOAuthCallbackTimeoutMs(2000);
					OAuthLoginCommand._test.setOpenAuthorizeInBrowser(
						(openFn, apps, url) => {
							authorizeUrl = new URL(url);
							callbackStatusPromise = sendCallback(
								`http://localhost:${port}/callback?state=${authorizeUrl.searchParams.get('state')}&code=auth-code`
							);
						}
					);
				})
				.stub(BoxCommand.prototype, '_loadSettings', (stub) =>
					stub.resolves({})
				)
				.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
					stub.callsFake(async () => structuredClone(environments))
				)
				.stub(BoxCommand.prototype, 'updateEnvironments', (stub) =>
					stub.callsFake(async (updated) => {
						savedEnvironments = updated;
					})
				)
				.stub(CLITokenCache.prototype, 'read', (stub) =>
					stub.callsFake((callback) => callback(null, cachedTokenInfo))
				)
				.stub(CLITokenCache.prototype, 'write', (stub) =>
					stub.callsFake((tokenInfo, callback) => {
						cachedTokenInfo = tokenInfo;
						callback();
					})
				)
				.nock('https://api.box.com', (api) => {
					const tokenRequest = api.post('/oauth2/token', (body) => {
							// PKCE: no client secret, and the verifier must match the challenge in the authorize URL
							assert.deepEqual(Object.keys(body).sort(), [
								'client_id',
								'code',
								'code_verifier',
								'grant_type',
							]);
							assert.equal(body.grant_type, 'authorization_code');
							assert.equal(body.client_id, PUBLIC_CLIENT_ID);
							assert.equal(body.code, 'auth-code');
							assert.equal(
								createHash('sha256')
									.update(body.code_verifier)
									.digest('base64url'),
								authorizeUrl.searchParams.get('code_challenge')
							);
							return true;
						});
					if (failedTokenResponse) {
						tokenRequest.reply(
							failedTokenResponse.status,
							failedTokenResponse.body
						);
						return;
					}
					tokenRequest
						.reply(200, {
							access_token: 'public-access-token',
							refresh_token: 'public-refresh-token',
							expires_in: 3600,
							token_type: 'bearer',
							restricted_to: [],
						})
						.get('/2.0/users/me')
						.matchHeader('Authorization', 'Bearer public-access-token')
						.reply(200, {
							type: 'user',
							id: '33333',
							login: 'public@example.com',
						});
				});
		}

		const failedLoginArgs = ['login', '--public-client', '--port', 'PORT'];
		publicClientLoginTest(
			{ default: '', environments: {} },
			failedLoginArgs,
			{
				status: 400,
				body: {
					error: 'invalid_grant',
					error_description: 'The redirect URI is missing or does not match',
				},
			}
		)
			.stub(inquirer, 'prompt', (stub) =>
				stub.resolves({ clientId: PUBLIC_CLIENT_ID })
			)
			.stderr()
			.command(failedLoginArgs)
			.it(
				'should show the reason from Box when the token exchange fails',
				async (ctx) => {
					assert.strictEqual(await callbackStatusPromise, 500);
					assert.include(
						ctx.stderr,
						'Login failed: The redirect URI is missing or does not match'
					);
					assert.isNull(savedEnvironments);
				}
			);

		const loginArgs = ['login', '--public-client', '--port', 'PORT'];
		publicClientLoginTest({ default: '', environments: {} }, loginArgs)
			.stub(inquirer, 'prompt', (stub) =>
				stub.resolves({ clientId: PUBLIC_CLIENT_ID })
			)
			.stderr()
			.command(loginArgs)
			.it(
				'should log in with PKCE and create a public client environment without a secret',
				async (ctx) => {
					assert.strictEqual(await callbackStatusPromise, 200);
					assert.include(
						ctx.stderr,
						'Successfully logged in as public@example.com!'
					);
					assert.equal(
						authorizeUrl.origin + authorizeUrl.pathname,
						'https://account.box.com/api/oauth2/authorize'
					);
					assert.equal(
						authorizeUrl.searchParams.get('client_id'),
						PUBLIC_CLIENT_ID
					);
					assert.equal(
						authorizeUrl.searchParams.get('redirect_uri'),
						`http://localhost:${port}/callback`
					);
					assert.equal(
						authorizeUrl.searchParams.get('code_challenge_method'),
						'S256'
					);
					assert.deepEqual(savedEnvironments, {
						default: 'oauth',
						environments: {
							oauth: {
								clientId: PUBLIC_CLIENT_ID,
								name: 'oauth',
								cacheTokens: true,
								authMethod: 'oauth20',
								publicClient: true,
							},
						},
					});
					assert.equal(
						cachedTokenInfo.accessToken,
						'public-access-token'
					);
					assert.equal(
						cachedTokenInfo.refreshToken,
						'public-refresh-token'
					);
				}
			);

		const reauthorizeArgs = [
			'login',
			'--reauthorize',
			'-n',
			'public-env',
			'--port',
			'PORT',
		];
		let promptStub;
		publicClientLoginTest(
			{
			default: 'public-env',
			environments: {
				'public-env': {
					clientId: PUBLIC_CLIENT_ID,
					name: 'public-env',
					cacheTokens: true,
					authMethod: 'oauth20',
					publicClient: true,
				},
			},
			},
			reauthorizeArgs
		)
			.do(() => {
				promptStub = sandbox.stub(inquirer, 'prompt');
			})
			.stderr()
			.command(reauthorizeArgs)
			.it(
				'should reauthorize a public client environment with PKCE without prompting',
				async (ctx) => {
					assert.strictEqual(await callbackStatusPromise, 200);
					assert.isTrue(promptStub.notCalled);
					assert.include(
						ctx.stderr,
						'Environment "public-env" has been updated'
					);
					assert.deepEqual(
						savedEnvironments.environments['public-env'],
						{
							clientId: PUBLIC_CLIENT_ID,
							name: 'public-env',
							cacheTokens: true,
							authMethod: 'oauth20',
							publicClient: true,
						}
					);
				}
			);
	});
});
