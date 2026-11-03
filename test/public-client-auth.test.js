'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const sinon = require('sinon');
const BoxCommand = require('../src/box-command');
const CLITokenCache = require('../src/token-cache');
const { TEST_API_ROOT } = require('./helpers/test-helper');

const CLIENT_ID = 'public-client-id';
const ENVIRONMENT_NAME = 'public-env';
const ONE_HOUR_MS = 60 * 60 * 1000;

// A public client has no secret, so refresh requests must not carry one.
function mockRefreshTokenRequest(api) {
	return api
		.post('/oauth2/token', (body) => {
			assert.deepEqual(body, {
				grant_type: 'refresh_token',
				client_id: CLIENT_ID,
				refresh_token: 'cached-refresh-token',
			});
			return true;
		})
		.reply(200, {
			access_token: 'refreshed-access-token',
			refresh_token: 'refreshed-refresh-token',
			expires_in: 3600,
			token_type: 'bearer',
			restricted_to: [],
		});
}

describe('Public client (PKCE) authentication', function () {
	let environments;
	let cachedTokenInfo;

	function useEnvironment(overrides = {}) {
		environments = {
			default: ENVIRONMENT_NAME,
			environments: {
				[ENVIRONMENT_NAME]: {
					name: ENVIRONMENT_NAME,
					authMethod: 'oauth20',
					publicClient: true,
					clientId: CLIENT_ID,
					cacheTokens: true,
					...overrides,
				},
			},
		};
	}

	function cacheToken(overrides = {}) {
		cachedTokenInfo = {
			accessToken: 'cached-access-token',
			refreshToken: 'cached-refresh-token',
			accessTokenTTLMS: ONE_HOUR_MS,
			acquiredAtMS: Date.now(),
			...overrides,
		};
	}

	function expireCachedToken() {
		cacheToken({ acquiredAtMS: Date.now() - 2 * ONE_HOUR_MS });
	}

	// Token cache backed by memory, so tests never touch secure storage or disk.
	function publicClientTest() {
		return test
			.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
				stub.callsFake(() => Promise.resolve(environments))
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
			.stub(CLITokenCache.prototype, 'clear', (stub) =>
				stub.callsFake((callback) => {
					cachedTokenInfo = {};
					callback();
				})
			);
	}

	beforeEach(function () {
		useEnvironment();
		cacheToken();
	});

	afterEach(function () {
		sinon.restore();
	});

	describe('legacy SDK client commands', function () {
		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/users/me')
					.matchHeader('Authorization', 'Bearer cached-access-token')
					.reply(200, { type: 'user', id: '33333' })
			)
			.stdout()
			.command(['users:get', 'me', '--json'])
			.it('should use the cached access token', (context) => {
				assert.equal(JSON.parse(context.stdout).id, '33333');
				// Secure storage reads are IPC calls, so the token cache is read once per command
				assert.equal(CLITokenCache.prototype.read.callCount, 1);
			});

		publicClientTest()
			.do(() => expireCachedToken())
			.nock(TEST_API_ROOT, (api) =>
				mockRefreshTokenRequest(api)
					.get('/2.0/users/me')
					.matchHeader(
						'Authorization',
						'Bearer refreshed-access-token'
					)
					.reply(200, { type: 'user', id: '33333' })
			)
			.stdout()
			.command(['users:get', 'me', '--json'])
			.it(
				'should refresh an expired token without a client secret and cache it',
				(context) => {
					assert.equal(JSON.parse(context.stdout).id, '33333');
					assert.equal(
						cachedTokenInfo.accessToken,
						'refreshed-access-token'
					);
					assert.equal(
						cachedTokenInfo.refreshToken,
						'refreshed-refresh-token'
					);
				}
			);

		publicClientTest()
			.do(() => expireCachedToken())
			.nock(TEST_API_ROOT, (api) =>
				api.post('/oauth2/token').reply(400, {
					error: 'invalid_grant',
					error_description: 'Refresh token has expired',
				})
			)
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should ask to reauthorize when the refresh token has expired',
				(context) => {
					assert.include(
						context.stderr,
						'Your refresh token has expired'
					);
					assert.include(
						context.stderr,
						`box login --name ${ENVIRONMENT_NAME} --reauthorize`
					);
				}
			);

		publicClientTest()
			.do(() => {
				cachedTokenInfo = {};
			})
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should ask to reauthorize when no token is cached',
				(context) => {
					assert.include(
						context.stderr,
						`box login --name ${ENVIRONMENT_NAME} --reauthorize`
					);
				}
			);

		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				// An empty 401 body is how the legacy client recognizes an expired access token
				api.get('/2.0/users/me').reply(401)
			)
			.stderr()
			.command(['users:get', 'me', '--no-color'])
			.it(
				'should mark a rejected access token as expired and keep the refresh token',
				() => {
					assert.equal(cachedTokenInfo.accessTokenTTLMS, 0);
					assert.equal(
						cachedTokenInfo.refreshToken,
						'cached-refresh-token'
					);
				}
			);
	});

	describe('TypeScript SDK client commands', function () {
		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/hubs/12345')
					.matchHeader('Authorization', 'Bearer cached-access-token')
					.reply(200, { type: 'hubs', id: '12345' })
			)
			.stdout()
			.command(['hubs:get', '12345', '--json'])
			.it('should use the cached access token', (context) => {
				assert.equal(JSON.parse(context.stdout).id, '12345');
			});

		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/hubs/12345')
					.reply(401, {
						type: 'error',
						status: 401,
						code: 'unauthorized',
						message: 'Unauthorized',
					})
					.post('/oauth2/token', (body) => {
						assert.notProperty(body, 'client_secret');
						return true;
					})
					.reply(400, {
						error: 'invalid_grant',
						error_description: 'Refresh token has expired',
					})
			)
			.stderr()
			.command(['hubs:get', '12345', '--no-color'])
			.it(
				'should ask to reauthorize when the refresh token has expired',
				(context) => {
					assert.include(
						context.stderr,
						'Your refresh token has expired'
					);
				}
			);
	});

	describe('tokens:exchange', function () {
		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/token', (body) => {
						assert.equal(
							body.grant_type,
							'urn:ietf:params:oauth:grant-type:token-exchange'
						);
						assert.equal(body.subject_token, 'cached-access-token');
						assert.equal(body.scope, 'item_preview');
						assert.equal(
							body.resource,
							'https://api.box.com/2.0/files/123'
						);
						assert.notProperty(body, 'client_secret');
						return true;
					})
					.reply(200, {
						access_token: 'downscoped-token',
						expires_in: 1800,
						token_type: 'bearer',
						restricted_to: [],
					})
			)
			.stdout()
			.command(['tokens:exchange', 'item_preview', '--file-id=123'])
			.it('should downscope the cached token', (context) => {
				assert.equal(context.stdout.trim(), 'downscoped-token');
			});

		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api.post('/oauth2/token').reply(400, {
					error: 'invalid_grant',
					error_description: 'The subject token is not valid',
				})
			)
			.stderr()
			.command(['tokens:exchange', 'item_preview', '--no-color'])
			.it(
				'should show the downscope error instead of asking to reauthorize',
				(context) => {
					assert.include(
						context.stderr,
						'invalid_grant - The subject token is not valid'
					);
					assert.notInclude(context.stderr, 'refresh token has expired');
				}
			);
	});

	describe('tokens:revoke', function () {
		let revokeRequestHeaders;

		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/revoke', {
						client_id: CLIENT_ID,
						token: 'token-to-revoke',
					})
					.reply(function () {
						revokeRequestHeaders = this.req.headers;
						return [200];
					})
			)
			.stderr()
			.command(['tokens:revoke', 'token-to-revoke', '--no-color'])
			.it(
				"should revoke without a client secret or the environment's own token",
				(context) => {
					assert.include(context.stderr, 'Token revoked.');
					assert.notProperty(revokeRequestHeaders, 'authorization');
				}
			);

		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api.post('/oauth2/revoke').reply(400, {
					error: 'invalid_token',
					error_description: 'The token is invalid',
				})
			)
			.stderr()
			.command(['tokens:revoke', 'token-to-revoke', '--no-color'])
			.it(
				'should report a failed revoke like the confidential OAuth path',
				(context) => {
					assert.include(
						context.stderr,
						'Error revoking token!  Request failed with status 400'
					);
				}
			);
	});

	describe('logout', function () {
		publicClientTest()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/revoke', {
						client_id: CLIENT_ID,
						token: 'cached-access-token',
					})
					.reply(200)
			)
			.stderr()
			.command([
				'logout',
				'--force',
				'--on-revoke-failure=abort',
				'--no-color',
			])
			.it(
				'should revoke without a client secret and clear the token cache',
				(context) => {
					assert.include(
						context.stderr,
						`Successfully logged out from "${ENVIRONMENT_NAME}" environment.`
					);
					assert.isUndefined(cachedTokenInfo.accessToken);
				}
			);
	});
});
