'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const sinon = require('sinon');
const BoxCommand = require('../../src/box-command');
const BoxSDK = require('box-node-sdk').default;
const CLITokenCache = require('../../src/token-cache');
const inquirer = require('inquirer');
const OAuthLogoutCommand = require('../../src/commands/logout');

const OAUTH_ENV = {
	default: 'oauth',
	environments: {
		oauth: {
			authMethod: 'oauth20',
			clientId: 'cid',
			clientSecret: 'secret',
		},
	},
};

const OAUTH_ENV_NO_CREDS = {
	default: 'oauth',
	environments: {
		oauth: {
			authMethod: 'oauth20',
			clientId: '',
			clientSecret: '',
		},
	},
};

describe('Logout', function () {
	let sandbox;
	let getEnvironmentsStub;
	let tokenCacheGetStub;
	let tokenCacheClearStub;
	let revokeTokensStub;
	let confirmStub;
	let inquirerPromptStub;

	beforeEach(function () {
		sandbox = sinon.createSandbox();

		getEnvironmentsStub = sandbox.stub(
			BoxCommand.prototype,
			'getEnvironments'
		);
		tokenCacheGetStub = sandbox.stub(CLITokenCache.prototype, 'get');
		tokenCacheClearStub = sandbox.stub(CLITokenCache.prototype, 'clear');

		getEnvironmentsStub.resolves(OAUTH_ENV);

		revokeTokensStub = sandbox.stub(BoxSDK.prototype, 'revokeTokens');
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('logout command', function () {
		it('should expose --force flag', function () {
			assert.property(OAuthLogoutCommand.flags, 'force');
			assert.strictEqual(OAuthLogoutCommand.flags.force.char, 'f');
			assert.include(
				OAuthLogoutCommand.flags.force.description,
				'Skip confirmation prompt'
			);
		});

		it('should expose --on-revoke-failure flag', function () {
			assert.property(OAuthLogoutCommand.flags, 'on-revoke-failure');
			assert.include(
				OAuthLogoutCommand.flags['on-revoke-failure'].description,
				'clear'
			);
			assert.include(
				OAuthLogoutCommand.flags['on-revoke-failure'].description,
				'abort'
			);
			assert.sameMembers(
				OAuthLogoutCommand.flags['on-revoke-failure'].options,
				['clear', 'abort']
			);
		});

		test.do(() => {
			getEnvironmentsStub.resolves({ default: null, environments: {} });
		})
			.stderr()
			.command(['logout', '--force'])
			.it('should show error when no current environment', (ctx) => {
				assert.include(ctx.stderr, 'No current environment found');
			});

		test.do(() => {
			tokenCacheGetStub.resolves();
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should show already logged out when no access token',
				(ctx) => {
					assert.include(
						ctx.stderr,
						'You are already logged out from "oauth" environment'
					);
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			confirmStub = sandbox
				.stub(BoxCommand.prototype, 'confirm')
				.resolves(false);
		})
			.stderr()
			.command(['logout'])
			.it(
				'should cancel when user declines confirmation (no --force)',
				(ctx) => {
					assert.include(ctx.stderr, 'Logout cancelled');
					assert.isTrue(
						confirmStub.calledWith(
							sinon.match(/logout from "oauth"/)
						)
					);
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			confirmStub = sandbox
				.stub(BoxCommand.prototype, 'confirm')
				.resolves(true);
			revokeTokensStub.resolves({ statusCode: 200 });
		})
			.stderr()
			.command(['logout'])
			.it(
				'should successfully logout when user confirms (no --force)',
				(ctx) => {
					assert.isTrue(
						confirmStub.calledWith(
							sinon.match(/logout from "oauth"/)
						)
					);
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stderr,
						'Successfully logged out from "oauth"'
					);
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			revokeTokensStub.resolves({
				statusCode: 400,
				body: { error: 'invalid_token' },
			});
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should skip revoke and clear cache when revoke returns 400 invalid_token',
				(ctx) => {
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stderr,
						'Access token is already invalid'
					);
					assert.include(ctx.stderr, 'Successfully logged out');
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			revokeTokensStub.resolves({
				statusCode: 400,
				body: { error: 'invalid_request' },
			});
			inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({ action: 'clear' });
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should clear cache when revoke returns other 400 and user selects clear',
				(ctx) => {
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(inquirerPromptStub.calledOnce);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(ctx.stderr, 'Successfully logged out');
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			revokeTokensStub.resolves({ statusCode: 200 });
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should successfully logout and clear cache when revoke succeeds',
				(ctx) => {
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stderr,
						'Successfully logged out from "oauth"'
					);
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			revokeTokensStub.rejects(new Error('ECONNREFUSED'));
			inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({ action: 'clear' });
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should clear cache when revoke fails and user selects clear',
				(ctx) => {
					assert.isTrue(inquirerPromptStub.calledOnce);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(ctx.stderr, 'Successfully logged out');
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			revokeTokensStub.rejects(new Error('ECONNREFUSED'));
			inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({ action: 'abort' });
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should show abort message when revoke fails and user selects abort',
				(ctx) => {
					assert.isFalse(tokenCacheClearStub.called);
					assert.include(ctx.stderr, 'Logout aborted');
					assert.include(ctx.stderr, 'not revoked');
					assert.include(ctx.stderr, 'remains cached');
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			revokeTokensStub
				.onFirstCall()
				.rejects(new Error('ECONNREFUSED'))
				.onSecondCall()
				.resolves({ statusCode: 200 });
			inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({ action: 'retry' });
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should retry revoke when revoke fails and user selects retry, then succeed',
				(ctx) => {
					assert.strictEqual(revokeTokensStub.callCount, 2);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stderr,
						'Successfully logged out from "oauth"'
					);
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			revokeTokensStub.rejects(new Error('ECONNREFUSED'));
			inquirerPromptStub = sandbox.stub(inquirer, 'prompt');
		})
			.stderr()
			.command(['logout', '--force', '--on-revoke-failure=clear'])
			.it(
				'should use --on-revoke-failure=clear when revoke fails (skips prompt)',
				(ctx) => {
					assert.isFalse(inquirerPromptStub.called);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(ctx.stderr, 'Successfully logged out');
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			revokeTokensStub.rejects(new Error('ECONNREFUSED'));
			inquirerPromptStub = sandbox.stub(inquirer, 'prompt');
		})
			.stderr()
			.command(['logout', '--force', '--on-revoke-failure=abort'])
			.it(
				'should use --on-revoke-failure=abort when revoke fails (skips prompt)',
				(ctx) => {
					assert.isFalse(inquirerPromptStub.called);
					assert.isFalse(tokenCacheClearStub.called);
					assert.include(ctx.stderr, 'Logout aborted');
					assert.include(ctx.stderr, 'remains cached');
				}
			);

		test.do(() => {
			getEnvironmentsStub.resolves(OAUTH_ENV_NO_CREDS);
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({ action: 'clear' });
		})
			.stderr()
			.command(['logout', '--force'])
			.it(
				'should clear cache when credentials invalid and user selects clear',
				(ctx) => {
					assert.isFalse(revokeTokensStub.called);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(ctx.stderr, 'Successfully logged out');
				}
			);

		test.do(() => {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) =>
				cb(new Error('Clear failed'))
			);
			revokeTokensStub.resolves({ statusCode: 200 });
		})
			.stderr()
			.command(['logout', '--force'])
			.it('should reject when tokenCache.clear fails', (ctx) => {
				assert.include(ctx.stderr, 'Clear failed');
				assert.notInclude(ctx.stderr, 'Successfully logged out');
			});
	});
});
