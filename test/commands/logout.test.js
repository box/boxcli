'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const mockery = require('mockery');
describe('Logout', function () {
	let sandbox;
	let OAuthLogoutCommand;

	beforeEach(function () {
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
		sandbox.restore();
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('logout command', function () {
		it('should expose --force flag', function () {
			mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
			mockery.registerAllowable('../../src/commands/logout', true);
			OAuthLogoutCommand = require('../../src/commands/logout');

			assert.property(OAuthLogoutCommand.flags, 'force');
			assert.strictEqual(OAuthLogoutCommand.flags.force.char, 'f');
			assert.include(
				OAuthLogoutCommand.flags.force.description,
				'Skip confirmation'
			);
		});


		it('should error when no current environment', async function () {
			mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
			mockery.registerAllowable('../../src/commands/logout', true);
			OAuthLogoutCommand = require('../../src/commands/logout');

			const cmd = new OAuthLogoutCommand([], {});
			cmd.flags = { force: true };

			sandbox.stub(cmd, 'getEnvironments').resolves({
				default: null,
				environments: {},
			});
			sandbox.stub(cmd, 'error').throws(new Error('exit'));

			await assert.isRejected(cmd.run(), /exit/);
			assert.isTrue(cmd.error.calledOnce);
			assert.include(cmd.error.firstCall.args[0], 'No current environment found');
		});

		it('should error when current environment is not OAuth', async function () {
			mockery.enable({ useCleanCache: true, warnOnUnregistered: false });
			mockery.registerAllowable('../../src/commands/logout', true);
			OAuthLogoutCommand = require('../../src/commands/logout');

			const cmd = new OAuthLogoutCommand([], {});
			cmd.flags = { force: true };

			sandbox.stub(cmd, 'getEnvironments').resolves({
				default: 'jwt-env',
				environments: {
					'jwt-env': { authMethod: 'jwt' },
				},
			});
			sandbox.stub(cmd, 'error').throws(new Error('exit'));

			await assert.isRejected(cmd.run(), /exit/);
			assert.isTrue(cmd.error.calledOnce);
			assert.include(
				cmd.error.firstCall.args[0],
				'Logout is only supported for OAuth environments'
			);
		});

		it('should show already logged out when no access token', async function () {
			mockery.enable({ useCleanCache: true, warnOnUnregistered: false });

			const mockTokenCache = {
				get: sandbox.stub().resolves(undefined),
			};
			const MockCLITokenCache = sandbox.stub().returns(mockTokenCache);
			mockery.registerMock('../token-cache', MockCLITokenCache);
			mockery.registerAllowable('../../src/commands/logout', true);
			OAuthLogoutCommand = require('../../src/commands/logout');

			const cmd = new OAuthLogoutCommand([], {});
			cmd.flags = { force: true };
			sandbox.stub(cmd, 'getEnvironments').resolves({
				default: 'oauth',
				environments: {
					oauth: {
						authMethod: 'oauth20',
						clientId: 'cid',
						clientSecret: 'secret',
					},
				},
			});
			sandbox.stub(cmd, 'info');

			await cmd.run();

			assert.isTrue(cmd.info.calledWith(sinon.match(/You are already logged out/)));
		});

		it('should cancel when user declines confirmation (no --force)', async function () {
			mockery.enable({ useCleanCache: true, warnOnUnregistered: false });

			const mockTokenCache = {
				get: sandbox.stub().resolves({
					accessToken: 'test-token',
					refreshToken: 'refresh',
				}),
			};
			const MockCLITokenCache = sandbox.stub().returns(mockTokenCache);
			mockery.registerMock('../token-cache', MockCLITokenCache);
			mockery.registerAllowable('../../src/commands/logout', true);
			OAuthLogoutCommand = require('../../src/commands/logout');

			const cmd = new OAuthLogoutCommand([], {});
			cmd.flags = { force: false };
			sandbox.stub(cmd, 'getEnvironments').resolves({
				default: 'oauth',
				environments: {
					oauth: {
						authMethod: 'oauth20',
						clientId: 'cid',
						clientSecret: 'secret',
					},
				},
			});
			sandbox.stub(cmd, 'confirm').resolves(false);
			sandbox.stub(cmd, 'info');

			await cmd.run();

			assert.isTrue(cmd.confirm.calledWith(sinon.match(/logout from "oauth"/)));
			assert.isTrue(cmd.info.calledWith(sinon.match(/Logout cancelled/)));
			assert.isTrue(mockTokenCache.get.called);
		});

		it('should successfully logout and clear cache when revoke succeeds', async function () {
			mockery.enable({ useCleanCache: true, warnOnUnregistered: false });

			const mockTokenCache = {
				get: sandbox.stub().resolves({
					accessToken: 'test-token',
					refreshToken: 'refresh',
				}),
				clear: sandbox.stub().callsFake((cb) => cb(null)),
			};
			const MockCLITokenCache = sandbox.stub().returns(mockTokenCache);

			const mockRevokeTokens = sandbox.stub().resolves();
			const MockBoxSDK = sandbox.stub().returns({
				revokeTokens: mockRevokeTokens,
			});

			mockery.registerMock('../token-cache', MockCLITokenCache);
			mockery.registerMock('box-node-sdk', {
				default: MockBoxSDK,
			});
			mockery.registerAllowable('../../src/commands/logout', true);
			OAuthLogoutCommand = require('../../src/commands/logout');

			const cmd = new OAuthLogoutCommand([], {});
			cmd.flags = { force: true };
			sandbox.stub(cmd, 'getEnvironments').resolves({
				default: 'oauth',
				environments: {
					oauth: {
						authMethod: 'oauth20',
						clientId: 'cid',
						clientSecret: 'secret',
					},
				},
			});
			sandbox.stub(cmd, 'info');

			await cmd.run();

			assert.isTrue(mockRevokeTokens.calledWith('test-token'));
			assert.isTrue(mockTokenCache.clear.called);
			assert.isTrue(
				cmd.info.calledWith(sinon.match(/Successfully logged out from "oauth"/))
			);
		});
	});
});
