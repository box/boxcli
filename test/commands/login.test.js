'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const inquirer = require('inquirer');
const { test } = require('@oclif/test');
const BoxCommand = require('../../src/box-command');
const {
	assertValidOAuthCode,
	getTokenInfoByAuthCode,
} = require('../../src/login-helper');
const OAuthLoginCommand = require('../../src/commands/login');

describe('Login', function () {
	let sandbox;
	const DEFAULT_CLIENT_ID = 'udz8zp4yue87uk9dzq4xk425kkwvqvh1';
	const DEFAULT_CLIENT_SECRET = 'iZ1MbvC3ZaF25nbJli7IsKdRHAxfu3fn';

	beforeEach(function () {
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
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
			assert.deepInclude(OAuthLoginCommand.flags['platform-app'], {
				exclusive: ['default-box-app'],
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
			assert.include(promptConfig.message, '[2] Use a Box Platform app');
			assert.include(promptConfig.message, '[q] Quit');
			assert.include(promptConfig.message, 'Enter 1, 2, or q:');
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
				await OAuthLoginCommand._test.promptForCustomAppCredentials({
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
				await OAuthLoginCommand._test.promptForCustomAppCredentials(
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

			await OAuthLoginCommand._test.promptForCustomAppCredentials({
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

		it('should show error when specified env does not exist and no current env', async function () {
			getEnvironmentsStub.resolves({ default: '', environments: {} });

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stdout()
				.command(['login', '--reauthorize', '-n', 'nonexistent'])
				.it(
					'shows error when env does not exist and no current env',
					(ctx) => {
						assert.include(
							ctx.stdout,
							'The "nonexistent" environment does not exist'
						);
					}
				);
		});

		it('should show error when specified env does not exist and current env is not OAuth', async function () {
			getEnvironmentsStub.resolves({
				default: 'jwt-env',
				environments: {
					'jwt-env': { authMethod: 'jwt', clientId: 'cid' },
				},
			});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stdout()
				.command(['login', '--reauthorize', '-n', 'nonexistent'])
				.it(
					'shows error when env does not exist and current is not oauth',
					(ctx) => {
						assert.include(
							ctx.stdout,
							'The "nonexistent" environment does not exist'
						);
					}
				);
		});

		it('should show error when specified env does not exist and name is not oauth (even if current is OAuth)', async function () {
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

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stdout()
				.command(['login', '--reauthorize', '-n', 'nonexistent'])
				.it('does not fallback when name is not oauth', (ctx) => {
					assert.include(
						ctx.stdout,
						'The "nonexistent" environment does not exist'
					);
				});
		});

		it('should use current OAuth env when name is oauth and that env does not exist', async function () {
			const promptStub = sandbox.stub(inquirer, 'prompt').resolves({
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

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stdout()
				.command([
					'login',
					'--reauthorize',
					'-n',
					'oauth',
					'--default-box-app',
					'--code',
					'--port',
					'16987',
				])
				.it(
					'falls back to current oauth env when name is oauth and env does not exist',
					(ctx) => {
						assert.notInclude(
							ctx.stdout,
							'The "oauth" environment does not exist'
						);
						assert.include(ctx.stdout, 'Please open');
						assert.isTrue(promptStub.calledOnce);
					}
				);
		});
	});
});
