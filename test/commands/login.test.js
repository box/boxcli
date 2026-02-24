'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const {
	assertValidOAuthCode,
	getTokenInfoWithPKCE,
} = require('../../src/login-helper');
const OAuthLoginCommand = require('../../src/commands/login');

describe('Login', function () {
	let sandbox;

	beforeEach(function () {
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('getTokenInfoWithPKCE', function () {
		it('should exchange auth code with code_verifier and redirect_uri', async function () {
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

			const result = await getTokenInfoWithPKCE(
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

		it('should throw when token manager is unavailable', async function () {
			try {
				await getTokenInfoWithPKCE(
					{},
					'auth-code',
					'http://localhost:3000/callback',
					'pkce-verifier'
				);
				assert.fail('Expected getTokenInfoWithPKCE to throw');
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
		it('should expose --default-box-app and --custom-app flags', function () {
			assert.property(OAuthLoginCommand.flags, 'default-box-app');
			assert.property(OAuthLoginCommand.flags, 'custom-app');
		});

		it('should keep login type flags mutually exclusive', function () {
			assert.deepEqual(OAuthLoginCommand.flags['default-box-app'].exclusive, [
				'custom-app',
			]);
			assert.deepEqual(OAuthLoginCommand.flags['custom-app'].exclusive, [
				'default-box-app',
			]);
		});
	});
});
