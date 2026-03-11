'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
const BoxCommand = require('../../src/box-command');
const CLITokenCache = require('../../src/token-cache');
const inquirer = require('inquirer');

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
	let OAuthLogoutCommand;

	beforeEach(function () {
		sandbox = sinon.createSandbox();

		getEnvironmentsStub = sandbox.stub(
			BoxCommand.prototype,
			'getEnvironments'
		);
		tokenCacheGetStub = sandbox.stub(CLITokenCache.prototype, 'get');
		tokenCacheClearStub = sandbox.stub(CLITokenCache.prototype, 'clear');

		getEnvironmentsStub.resolves(OAUTH_ENV);

		revokeTokensStub = sandbox.stub();
		mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
		mockery.registerMock('box-node-sdk', {
			default: function () {
				return { revokeTokens: revokeTokensStub };
			},
		});
		mockery.registerAllowable('../../src/commands/logout', true);
		delete require.cache[require.resolve('../../src/commands/logout')];
		OAuthLogoutCommand = require('../../src/commands/logout');
	});

	afterEach(function () {
		sandbox.restore();
		mockery.deregisterAll();
		mockery.disable();
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

		it('should show error when no current environment', async function () {
			getEnvironmentsStub.resolves({ default: null, environments: {} });

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.command(['logout', '--force'])
				.catch((error) => {
					assert.include(
						error.message,
						'No current environment found'
					);
				})
				.it('errors when no current environment');
		});

		it('should show already logged out when no access token', async function () {
			tokenCacheGetStub.resolves();

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stdout()
				.command(['logout', '--force'])
				.it('shows already logged out', (ctx) => {
					assert.include(
						ctx.stdout,
						'You are already logged out from "oauth" environment'
					);
				});
		});

		it('should cancel when user declines confirmation (no --force)', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			const confirmStub = sandbox
				.stub(BoxCommand.prototype, 'confirm')
				.resolves(false);

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(BoxCommand.prototype, 'confirm', confirmStub)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stdout()
				.command(['logout'])
				.it('cancels when user declines', (ctx) => {
					assert.include(ctx.stdout, 'Logout cancelled');
					assert.isTrue(
						confirmStub.calledWith(
							sinon.match(/logout from "oauth"/)
						)
					);
				});
		});

		it('should successfully logout when user confirms (no --force)', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));
			const confirmStub = sandbox
				.stub(BoxCommand.prototype, 'confirm')
				.resolves(true);
			revokeTokensStub.resolves({ statusCode: 200 });

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(BoxCommand.prototype, 'confirm', confirmStub)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stdout()
				.command(['logout'])
				.it('logs out when user confirms', (ctx) => {
					assert.isTrue(
						confirmStub.calledWith(
							sinon.match(/logout from "oauth"/)
						)
					);
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stdout,
						'Successfully logged out from "oauth"'
					);
				});
		});

		it('should skip revoke and clear cache when revoke returns 400 invalid_token', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));

			revokeTokensStub.resolves({
				statusCode: 400,
				body: { error: 'invalid_token' },
			});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stdout()
				.command(['logout', '--force'])
				.it(
					'skips revoke and clears cache for invalid_token',
					(ctx) => {
						assert.isTrue(
							revokeTokensStub.calledWith('test-token')
						);
						assert.isTrue(tokenCacheClearStub.called);
						assert.include(
							ctx.stdout,
							'Access token is already invalid'
						);
						assert.include(ctx.stdout, 'Successfully logged out');
					}
				);
		});

		it('should clear cache when revoke returns other 400 and user selects clear', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));

			revokeTokensStub.resolves({
				statusCode: 400,
				body: { error: 'invalid_request' },
			});

			const inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({
					action: 'clear',
				});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force'])
				.it('clears cache when user selects clear', (ctx) => {
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(ctx.stdout, 'Successfully logged out');
				});
		});

		it('should successfully logout and clear cache when revoke succeeds', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));

			revokeTokensStub.resolves({ statusCode: 200 });

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stdout()
				.command(['logout', '--force'])
				.it('successfully logs out when revoke succeeds', (ctx) => {
					assert.isTrue(revokeTokensStub.calledWith('test-token'));
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stdout,
						'Successfully logged out from "oauth"'
					);
				});
		});

		it('should clear cache when revoke fails and user selects clear', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));

			revokeTokensStub.rejects(new Error('ECONNREFUSED'));

			const inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({
					action: 'clear',
				});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force'])
				.it(
					'clears cache when revoke fails and user selects clear',
					(ctx) => {
						assert.isTrue(tokenCacheClearStub.called);
						assert.include(ctx.stdout, 'Successfully logged out');
					}
				);
		});

		it('should show abort message when revoke fails and user selects abort', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});

			revokeTokensStub.rejects(new Error('ECONNREFUSED'));

			const inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({
					action: 'abort',
				});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force'])
				.it('shows abort message when user selects abort', (ctx) => {
					assert.isFalse(tokenCacheClearStub.called);
					assert.include(ctx.stdout, 'Logout aborted');
					assert.include(ctx.stdout, 'not revoked');
					assert.include(ctx.stdout, 'remains cached');
				});
		});

		it('should retry revoke when revoke fails and user selects retry, then succeed', async function () {
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

			const inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({
					action: 'retry',
				});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force'])
				.it('retries revoke and succeeds', (ctx) => {
					assert.strictEqual(revokeTokensStub.callCount, 2);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(
						ctx.stdout,
						'Successfully logged out from "oauth"'
					);
				});
		});

		it('should use --on-revoke-failure=clear when revoke fails (skips prompt)', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));

			revokeTokensStub.rejects(new Error('ECONNREFUSED'));

			const inquirerPromptStub = sandbox.stub(inquirer, 'prompt');

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force', '--on-revoke-failure=clear'])
				.it('clears cache using flag (no prompt)', (ctx) => {
					assert.isFalse(inquirerPromptStub.called);
					assert.isTrue(tokenCacheClearStub.called);
					assert.include(ctx.stdout, 'Successfully logged out');
				});
		});

		it('should use --on-revoke-failure=abort when revoke fails (skips prompt)', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});

			revokeTokensStub.rejects(new Error('ECONNREFUSED'));

			const inquirerPromptStub = sandbox.stub(inquirer, 'prompt');

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force', '--on-revoke-failure=abort'])
				.it('aborts using flag (no prompt)', (ctx) => {
					assert.isFalse(inquirerPromptStub.called);
					assert.isFalse(tokenCacheClearStub.called);
					assert.include(ctx.stdout, 'Logout aborted');
					assert.include(ctx.stdout, 'remains cached');
				});
		});

		it('should clear cache when credentials invalid and user selects clear', async function () {
			getEnvironmentsStub.resolves(OAUTH_ENV_NO_CREDS);
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) => cb(null));

			const inquirerPromptStub = sandbox
				.stub(inquirer, 'prompt')
				.resolves({
					action: 'clear',
				});

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.stub(inquirer, 'prompt', inquirerPromptStub)
				.stdout()
				.command(['logout', '--force'])
				.it(
					'clears cache when credentials invalid and user selects clear',
					(ctx) => {
						assert.isFalse(revokeTokensStub.called);
						assert.isTrue(tokenCacheClearStub.called);
						assert.include(ctx.stdout, 'Successfully logged out');
					}
				);
		});

		it('should reject when tokenCache.clear fails', async function () {
			tokenCacheGetStub.resolves({
				accessToken: 'test-token',
				refreshToken: 'refresh',
			});
			tokenCacheClearStub.callsFake((cb) =>
				cb(new Error('Clear failed'))
			);

			revokeTokensStub.resolves({ statusCode: 200 });

			await test
				.stub(
					BoxCommand.prototype,
					'getEnvironments',
					getEnvironmentsStub
				)
				.stub(CLITokenCache.prototype, 'get', tokenCacheGetStub)
				.stub(CLITokenCache.prototype, 'clear', tokenCacheClearStub)
				.command(['logout', '--force'])
				.catch((error) => {
					assert.include(error.message, 'Clear failed');
				})
				.it('rejects when tokenCache.clear fails');
		});
	});
});
