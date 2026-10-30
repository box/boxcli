'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const PlatformAccountSessionAdapter = require('../src/platform-account-session-adapter');

const ONE_HOUR_MS = 60 * 60 * 1000;
const EXPIRY_BUFFER_MS = 60 * 1000;

const NETWORK_SESSION = Object.freeze({ name: 'configured network session' });

function createTokenStorage(initialToken) {
	let token = initialToken;
	return {
		get: sinon.stub().callsFake(async () => token),
		store: sinon.stub().callsFake(async (newToken) => {
			token = newToken;
		}),
		clear: sinon.stub().callsFake(async () => {
			token = undefined;
		}),
	};
}

const DEFAULT_ISSUED_TOKEN = Object.freeze({
	accessToken: 'new-token',
	expiresIn: 3600,
});

function createAuth(tokenStorage, issuedToken = DEFAULT_ISSUED_TOKEN) {
	return {
		tokenStorage,
		refreshToken: sinon.stub().callsFake(async () => {
			await tokenStorage.store(issuedToken);
			return issuedToken;
		}),
		revokeToken: sinon.stub().resolves(),
		downscopeToken: sinon.stub().rejects(new Error('must not be called')),
	};
}

function createAdapter(auth) {
	return new PlatformAccountSessionAdapter(auth, {
		expiryBufferMS: EXPIRY_BUFFER_MS,
		networkSession: NETWORK_SESSION,
	});
}

describe('PlatformAccountSessionAdapter', function () {
	describe('getAccessToken()', function () {
		it('returns a fresh token from the CLI token cache without requesting a new one', async function () {
			const auth = createAuth(
				createTokenStorage({
					accessToken: 'cached-token',
					accessTokenTTLMS: ONE_HOUR_MS,
					acquiredAtMS: Date.now(),
				})
			);

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'cached-token');
			assert.isFalse(auth.refreshToken.called);
		});

		it('requests a new token when the cached token expires within the expiry buffer', async function () {
			const auth = createAuth(
				createTokenStorage({
					accessToken: 'stale-token',
					accessTokenTTLMS: ONE_HOUR_MS,
					acquiredAtMS:
						Date.now() - ONE_HOUR_MS + EXPIRY_BUFFER_MS / 2,
				})
			);

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'new-token');
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('requests a new token when the cache is empty', async function () {
			const auth = createAuth(createTokenStorage());

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'new-token');
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('reuses a token it requested itself when the storage keeps no timestamps', async function () {
			const auth = createAuth(createTokenStorage());
			const adapter = createAdapter(auth);

			await adapter.getAccessToken();
			const accessToken = await adapter.getAccessToken();

			assert.equal(accessToken, 'new-token');
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('requests a new token for a stored token without timestamps that it did not request', async function () {
			const auth = createAuth(
				createTokenStorage({
					accessToken: 'unknown-age-token',
					expiresIn: 3600,
				})
			);

			const accessToken = await createAdapter(auth).getAccessToken();

			assert.equal(accessToken, 'new-token');
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('shares a single token request between concurrent callers', async function () {
			const auth = createAuth(createTokenStorage());
			const adapter = createAdapter(auth);

			const tokens = await Promise.all([
				adapter.getAccessToken(),
				adapter.getAccessToken(),
				adapter.getAccessToken(),
			]);

			assert.deepEqual(tokens, ['new-token', 'new-token', 'new-token']);
			assert.isTrue(auth.refreshToken.calledOnce);
		});

		it('requests tokens through the configured network session', async function () {
			const auth = createAuth(createTokenStorage());

			await createAdapter(auth).getAccessToken();

			assert.strictEqual(
				auth.refreshToken.firstCall.args[0],
				NETWORK_SESSION
			);
		});

		it('propagates token request failures and retries on the next call', async function () {
			const auth = createAuth(createTokenStorage());
			auth.refreshToken.onFirstCall().rejects(new Error('invalid_grant'));
			const adapter = createAdapter(auth);

			try {
				await adapter.getAccessToken();
				assert.fail('Expected getAccessToken to reject');
			} catch (error) {
				assert.equal(error.message, 'invalid_grant');
			}
			const accessToken = await adapter.getAccessToken();

			assert.equal(accessToken, 'new-token');
			assert.isTrue(auth.refreshToken.calledTwice);
		});

		it('returns a Bluebird promise, as the legacy client chains asCallback() on it', function () {
			const auth = createAuth(createTokenStorage());

			const result = createAdapter(auth).getAccessToken();

			assert.isFunction(result.asCallback);
			return result;
		});
	});

	describe('revokeTokens()', function () {
		it('revokes through the generated SDK auth using the configured network session', async function () {
			const auth = createAuth(createTokenStorage());

			await createAdapter(auth).revokeTokens();

			assert.isTrue(auth.revokeToken.calledOnce);
			assert.strictEqual(
				auth.revokeToken.firstCall.args[0],
				NETWORK_SESSION
			);
		});

		it('requests a new token after revoking a token it requested itself', async function () {
			const auth = createAuth(createTokenStorage());
			auth.revokeToken.callsFake(() => auth.tokenStorage.clear());
			const adapter = createAdapter(auth);

			await adapter.getAccessToken();
			await adapter.revokeTokens();
			await adapter.getAccessToken();

			assert.isTrue(auth.refreshToken.calledTwice);
		});
	});

	describe('exchangeToken()', function () {
		it('rejects because Platform Account tokens cannot be downscoped', async function () {
			const auth = createAuth(createTokenStorage());

			const result = createAdapter(auth).exchangeToken(
				['item_preview'],
				'https://api.box.com/2.0/files/123'
			);

			assert.isFunction(result.asCallback);
			try {
				await result;
				assert.fail('Expected exchangeToken to reject');
			} catch (error) {
				assert.equal(
					error.message,
					'Token exchange and downscoping are not supported for Platform Account environments'
				);
			}
			assert.isFalse(auth.downscopeToken.called);
		});
	});

	describe('handleExpiredTokensError()', function () {
		it('clears the token cache and rethrows the original error', async function () {
			const auth = createAuth(
				createTokenStorage({
					accessToken: 'revoked-token',
					accessTokenTTLMS: ONE_HOUR_MS,
					acquiredAtMS: Date.now(),
				})
			);
			const expiredTokenError = new Error(
				'Expired Auth: Auth code or refresh token has expired'
			);

			try {
				await createAdapter(auth).handleExpiredTokensError(
					expiredTokenError
				);
				assert.fail('Expected handleExpiredTokensError to reject');
			} catch (error) {
				assert.strictEqual(error, expiredTokenError);
			}
			assert.isTrue(auth.tokenStorage.clear.calledOnce);
		});

		it('requests a new token on the next call after an expired-token error', async function () {
			const auth = createAuth(createTokenStorage());
			const adapter = createAdapter(auth);

			await adapter.getAccessToken();
			await adapter
				.handleExpiredTokensError(new Error('expired'))
				.catch(() => {});
			await adapter.getAccessToken();

			assert.isTrue(auth.refreshToken.calledTwice);
		});
	});
});
