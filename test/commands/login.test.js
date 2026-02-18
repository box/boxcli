'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
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
	});

	describe('promptForClientCredentials', function () {
		it('should fallback to default app when client ID is empty', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ clientID: '   ' });

			const result =
				await OAuthLoginCommand._test.promptForClientCredentials(
					{ prompt: promptStub }
				);

			assert.isTrue(promptStub.calledOnce);
			assert.deepEqual(result, {
				useDefaultBoxApp: true,
				clientId: DEFAULT_CLIENT_ID,
				clientSecret: DEFAULT_CLIENT_SECRET,
			});
		});

		it('should prompt for client secret when custom client ID is provided', async function () {
			const promptStub = sandbox
				.stub()
				.onFirstCall()
				.resolves({ clientID: 'custom-client-id' })
				.onSecondCall()
				.resolves({ clientSecret: 'custom-client-secret' });

			const result =
				await OAuthLoginCommand._test.promptForClientCredentials(
					{ prompt: promptStub }
				);

			assert.strictEqual(promptStub.callCount, 2);
			assert.deepEqual(result, {
				useDefaultBoxApp: false,
				clientId: 'custom-client-id',
				clientSecret: 'custom-client-secret',
			});
		});
	});
});
