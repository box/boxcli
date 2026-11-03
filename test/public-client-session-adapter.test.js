'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const PublicClientSessionAdapter = require('../src/public-client-session-adapter');
const CLITokenCache = require('../src/token-cache');
const utilities = require('../src/util');

const ONE_HOUR_MS = 60 * 60 * 1000;
const EXPIRY_BUFFER_MS = 60 * 1000;
const NETWORK_SESSION = Object.freeze({ name: 'configured network session' });

function createTokenStorage(initialToken) {
	let token = initialToken;
	return {
		get: sinon.stub().callsFake(async () => token),
		store: sinon.stub().callsFake(async (newToken) => {
			token = {
				accessToken: newToken.accessToken,
				refreshToken: newToken.refreshToken,
				accessTokenTTLMS: newToken.expiresIn * 1000,
				acquiredAtMS: Date.now(),
			};
		}),
		clear: sinon.stub().callsFake(async () => {
			token = undefined;
		}),
	};
}

function freshToken(overrides = {}) {
	return {
		accessToken: 'cached-token',
		refreshToken: 'cached-refresh-token',
		accessTokenTTLMS: ONE_HOUR_MS,
		acquiredAtMS: Date.now(),
		...overrides,
	};
}

function expiredToken() {
	return freshToken({ acquiredAtMS: Date.now() - 2 * ONE_HOUR_MS });
}

function createAuth(tokenStorage) {
	return {
		tokenStorage,
		refreshToken: sinon.stub().callsFake(async () => {
			const token = {
				accessToken: 'refreshed-token',
				refreshToken: 'refreshed-refresh-token',
				expiresIn: 3600,
			};
			await tokenStorage.store(token);
			return token;
		}),
		revokeToken: sinon.stub().resolves(),
		downscopeToken: sinon.stub().resolves({
			accessToken: 'downscoped-token',
			expiresIn: 1800,
			restrictedTo: [],
		}),
	};
}

function createAdapter(auth) {
	return new PublicClientSessionAdapter(auth, {
		environmentName: 'public-env',
		expiryBufferMS: EXPIRY_BUFFER_MS,
		networkSession: NETWORK_SESSION,
	});
}

describe('PublicClientSessionAdapter', function () {
	describe('getAccessToken()', function () {
		it('returns a fresh cached token without refreshing', async function () {
			const auth = createAuth(createTokenStorage(freshToken()));

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'cached-token');
			assert.isTrue(auth.refreshToken.notCalled);
		});

		it('returns a Bluebird promise, since the legacy client chains asCallback', function () {
			const auth = createAuth(createTokenStorage(freshToken()));

			const promise = createAdapter(auth).getAccessToken();

			assert.isFunction(promise.asCallback);
			return promise;
		});

		it('refreshes an expired token with the configured network session', async function () {
			const auth = createAuth(createTokenStorage(expiredToken()));

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'refreshed-token');
			assert.isTrue(auth.refreshToken.calledOnceWith(NETWORK_SESSION));
		});

		it('refreshes a token that expires within the expiry buffer', async function () {
			const auth = createAuth(
				createTokenStorage(
					freshToken({
						acquiredAtMS:
							Date.now() - ONE_HOUR_MS + EXPIRY_BUFFER_MS / 2,
					})
				)
			);

			await createAdapter(auth).getAccessToken();

			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('sends one refresh request for concurrent calls', async function () {
			const auth = createAuth(createTokenStorage(expiredToken()));
			const adapter = createAdapter(auth);

			const tokens = await Promise.all([
				adapter.getAccessToken(),
				adapter.getAccessToken(),
			]);

			assert.deepEqual(tokens, ['refreshed-token', 'refreshed-token']);
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('uses the initial token without reading the token cache', async function () {
			const tokenStorage = createTokenStorage(freshToken());
			const adapter = new PublicClientSessionAdapter(createAuth(tokenStorage), {
				environmentName: 'public-env',
				expiryBufferMS: EXPIRY_BUFFER_MS,
				networkSession: NETWORK_SESSION,
				initialToken: freshToken({ accessToken: 'initial-token' }),
			});

			const accessToken = await adapter.getAccessToken();

			assert.equal(accessToken, 'initial-token');
			assert.isTrue(tokenStorage.get.notCalled);
		});

		it('reads the token cache only once for repeated calls', async function () {
			const tokenStorage = createTokenStorage(freshToken());
			const adapter = createAdapter(createAuth(tokenStorage));

			await adapter.getAccessToken();
			await adapter.getAccessToken();
			await adapter.getAccessToken();

			assert.isTrue(tokenStorage.get.calledOnce);
		});

		it('keeps a refreshed token in memory without refreshing or reading the cache again', async function () {
			const tokenStorage = createTokenStorage(expiredToken());
			const auth = createAuth(tokenStorage);
			const adapter = createAdapter(auth);

			await adapter.getAccessToken();
			const readsAfterRefresh = tokenStorage.get.callCount;
			const accessToken = await adapter.getAccessToken();

			assert.equal(accessToken, 'refreshed-token');
			assert.isTrue(auth.refreshToken.calledOnce);
			assert.equal(tokenStorage.get.callCount, readsAfterRefresh);
		});

		it('asks to reauthorize when no token is cached', async function () {
			const auth = createAuth(createTokenStorage());

			try {
				await createAdapter(auth).getAccessToken();
				assert.fail('Expected getAccessToken() to reject');
			} catch (error) {
				assert.include(
					error.message,
					'box login --name public-env --reauthorize'
				);
			}
			assert.isTrue(auth.refreshToken.notCalled);
		});

		it('asks to reauthorize when the refresh token is rejected', async function () {
			const auth = createAuth(createTokenStorage(expiredToken()));
			auth.refreshToken.rejects(
				Object.assign(new Error('Request failed'), {
					responseInfo: {
						statusCode: 400,
						body: {
							error: 'invalid_grant',
							error_description: 'Refresh token has expired',
						},
					},
				})
			);

			try {
				await createAdapter(auth).getAccessToken();
				assert.fail('Expected getAccessToken() to reject');
			} catch (error) {
				assert.include(error.message, 'Your refresh token has expired');
				assert.include(
					error.message,
					'box login --name public-env --reauthorize'
				);
			}
		});
	});

	describe('parallel refresh', function () {
		it('uses the tokens of a parallel refresh when its refresh token was already used', async function () {
			const tokenStorage = createTokenStorage(expiredToken());
			const auth = createAuth(tokenStorage);
			// Another CLI process refreshes first, so this refresh token is no longer valid.
			auth.refreshToken.callsFake(async () => {
				await tokenStorage.store({
					accessToken: 'parallel-token',
					refreshToken: 'parallel-refresh-token',
					expiresIn: 3600,
				});
				throw Object.assign(new Error('Request failed'), {
					responseInfo: {
						statusCode: 400,
						body: { error: 'invalid_grant' },
					},
				});
			});

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'parallel-token');
		});
	});

	describe('handleExpiredTokensError()', function () {
		it('does not overwrite tokens that another process stored in the meantime', async function () {
			const tokenStorage = createTokenStorage(
				freshToken({
					accessToken: 'other-process-token',
					refreshToken: 'other-process-refresh-token',
				})
			);
			// This command still uses the token it read before the other process refreshed.
			const adapter = new PublicClientSessionAdapter(createAuth(tokenStorage), {
				environmentName: 'public-env',
				expiryBufferMS: EXPIRY_BUFFER_MS,
				networkSession: NETWORK_SESSION,
				initialToken: freshToken(),
			});

			try {
				await adapter.handleExpiredTokensError(new Error('Expired Auth'));
				assert.fail('Expected handleExpiredTokensError() to reject');
			} catch (error) {
				assert.equal(error.message, 'Expired Auth');
			}

			assert.isTrue(tokenStorage.store.notCalled);
		});

		it('does not touch the token cache while a refresh is running, so it cannot overwrite the new tokens', async function () {
			const tokenStorage = createTokenStorage(expiredToken());
			const auth = createAuth(tokenStorage);
			let finishRefresh;
			auth.refreshToken.callsFake(
				() =>
					new Promise((resolve) => {
						finishRefresh = async () => {
							const token = {
								accessToken: 'refreshed-token',
								refreshToken: 'refreshed-refresh-token',
								expiresIn: 3600,
							};
							await tokenStorage.store(token);
							resolve(token);
						};
					})
			);
			const adapter = createAdapter(auth);

			const tokenPromise = adapter.getAccessToken();
			while (!finishRefresh) {
				await new Promise((resolve) => setImmediate(resolve));
			}
			// Another request of the same command, sent with the old token, gets a 401 now.
			const expiredError = new Error('Expired Auth');
			try {
				await adapter.handleExpiredTokensError(expiredError);
				assert.fail('Expected handleExpiredTokensError() to reject');
			} catch (error) {
				assert.strictEqual(error, expiredError);
			}
			assert.isTrue(
				tokenStorage.store.notCalled,
				'the token cache must not be written while the refresh is running'
			);

			await finishRefresh();
			assert.equal(await tokenPromise, 'refreshed-token');
			const cachedToken = await tokenStorage.get();
			assert.equal(cachedToken.refreshToken, 'refreshed-refresh-token');
		});

		it('marks the cached access token as expired and keeps the refresh token, so the next command refreshes', async function () {
			const tokenStorage = createTokenStorage(freshToken());
			const auth = createAuth(tokenStorage);
			const expiredError = new Error('Expired Auth');
			const adapter = createAdapter(auth);
			// The request that gets the 401 used the cached token.
			await adapter.getAccessToken();

			try {
				await adapter.handleExpiredTokensError(expiredError);
				assert.fail('Expected handleExpiredTokensError() to reject');
			} catch (error) {
				assert.strictEqual(error, expiredError);
			}
			const cachedToken = await tokenStorage.get();
			assert.equal(cachedToken.refreshToken, 'cached-refresh-token');

			// A new adapter stands for the next CLI command.
			const accessToken = await createAdapter(auth).getAccessToken();
			assert.equal(accessToken, 'refreshed-token');
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('keeps the cached refresh token and refreshes on the next call', async function () {
			const tokenStorage = createTokenStorage(freshToken());
			const auth = createAuth(tokenStorage);
			const adapter = createAdapter(auth);
			const expiredError = new Error('Expired Auth');

			try {
				await adapter.handleExpiredTokensError(expiredError);
				assert.fail('Expected handleExpiredTokensError() to reject');
			} catch (error) {
				assert.strictEqual(error, expiredError);
			}
			assert.isTrue(tokenStorage.clear.notCalled);

			const accessToken = await adapter.getAccessToken();
			assert.equal(accessToken, 'refreshed-token');
			assert.isTrue(auth.refreshToken.calledOnce);
		});
	});

	describe('exchangeToken()', function () {
		it('downscopes the token and returns legacy token info', async function () {
			const auth = createAuth(createTokenStorage(freshToken()));

			const tokenInfo = await createAdapter(auth).exchangeToken(
				['item_preview'],
				'https://api.box.com/2.0/files/123'
			);

			assert.isTrue(
				auth.downscopeToken.calledOnceWith(
					['item_preview'],
					'https://api.box.com/2.0/files/123',
					undefined,
					NETWORK_SESSION
				)
			);
			assert.equal(tokenInfo.accessToken, 'downscoped-token');
			assert.equal(tokenInfo.accessTokenTTLMS, 1800 * 1000);
			assert.isNumber(tokenInfo.acquiredAtMS);
		});

		it('passes no resource when downscoping to scopes only', async function () {
			const auth = createAuth(createTokenStorage(freshToken()));

			await createAdapter(auth).exchangeToken(['item_preview'], null);

			assert.isUndefined(auth.downscopeToken.firstCall.args[1]);
		});
	});

	describe('revokeTokens()', function () {
		it('revokes the token and clears the token cache', async function () {
			const tokenStorage = createTokenStorage(freshToken());
			const auth = createAuth(tokenStorage);

			await createAdapter(auth).revokeTokens();

			assert.isTrue(auth.revokeToken.calledOnceWith(NETWORK_SESSION));
			assert.isTrue(tokenStorage.clear.calledOnce);
			assert.isTrue(
				auth.revokeToken.calledBefore(tokenStorage.clear),
				'the token must be read for revocation before the cache is cleared'
			);
		});

		it('waits until the CLI token cache is deleted', async function () {
			const tokenCache = new CLITokenCache('public-client-revoke-env');
			tokenCache.supportsSecureStorage = false;
			let deleted = false;
			const unlinkStub = sinon
				.stub(utilities, 'unlinkAsync')
				.callsFake(async () => {
					await new Promise((resolve) => setTimeout(resolve, 10));
					deleted = true;
				});
			const auth = createAuth(tokenCache);

			try {
				await createAdapter(auth).revokeTokens();
				assert.isTrue(unlinkStub.calledOnceWith(tokenCache.filePath));
				assert.isTrue(deleted);
			} finally {
				unlinkStub.restore();
			}
		});
	});
});
