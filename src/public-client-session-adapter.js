'use strict';

const BluebirdPromise = require('bluebird');
const DEBUG = require('./debug');
const {
	createReauthorizeError,
	isInvalidGrantError,
} = require('./public-client');

/**
 * Legacy SDK session that gets tokens from the generated SDK's
 * `BoxPublicClientOAuth`, so commands still using the legacy `BoxClient` work
 * in public client environments. The legacy SDK only knows OAuth with a client
 * secret, so refresh, downscope and revoke all go through the generated SDK auth.
 *
 * The legacy client chains Bluebird-only methods (`asCallback`) on everything
 * a session returns, so every public method returns a Bluebird promise.
 */
class PublicClientSessionAdapter {
	/**
	 * @param {BoxPublicClientOAuth} auth Generated SDK auth. Its token storage is shared with the generated SDK client.
	 * @param {Object} options Adapter options
	 * @param {string} options.environmentName Name of the CLI environment, used in reauthorize hints
	 * @param {number} options.expiryBufferMS Tokens expiring within this window are treated as expired
	 * @param {NetworkSession} options.networkSession Generated SDK network session used for token requests
	 * @param {Object} [options.initialToken] Token already read from the token cache, in its format
	 */
	constructor(
		auth,
		{ environmentName, expiryBufferMS, networkSession, initialToken }
	) {
		this._auth = auth;
		this._environmentName = environmentName;
		this._expiryBufferMS = expiryBufferMS;
		this._networkSession = networkSession;
		this._refreshPromise = null;
		this._forceRefresh = false;
		// Token in the CLI token cache format. Kept in memory like the built-in persistent
		// session does, so the token cache (secure storage or file) is not read on every request.
		this._token = initialToken?.accessToken ? initialToken : null;
	}

	/**
	 * Get a valid access token, refreshing it when it is missing or about to expire.
	 *
	 * @returns {Promise<string>} Bluebird promise resolving to the access token
	 */
	getAccessToken() {
		return BluebirdPromise.resolve(this._getValidToken()).then(
			(token) => token.accessToken
		);
	}

	/**
	 * Downscope the current access token. Resolves to legacy SDK token info,
	 * which is what the legacy `BoxClient.exchangeToken()` returns.
	 *
	 * @param {string[]} scopes Scopes of the new token
	 * @param {string} [resource] Full URL of the item to restrict the token to
	 * @returns {Promise<Object>} Bluebird promise resolving to the token info
	 */
	exchangeToken(scopes, resource) {
		return BluebirdPromise.resolve(
			this._getValidToken().then(() =>
				this._auth.downscopeToken(
					scopes,
					resource ?? undefined,
					undefined,
					this._networkSession
				)
			)
		).then((token) => ({
			accessToken: token.accessToken,
			accessTokenTTLMS: token.expiresIn * 1000,
			acquiredAtMS: Date.now(),
		}));
	}

	/**
	 * Revoke the current tokens and remove them from the token cache.
	 * Part of the legacy session interface (`BoxClient.revokeTokens()`), not used by CLI commands today.
	 *
	 * @returns {Promise<void>} Bluebird promise resolving when the tokens are revoked
	 */
	revokeTokens() {
		return BluebirdPromise.resolve(
			this._auth
				.revokeToken(this._networkSession)
				.then(() => this._auth.tokenStorage.clear())
		);
	}

	/**
	 * Called by the legacy client when the API rejects the access token as expired.
	 * Unlike the built-in persistent session, the token cache is not cleared,
	 * since it holds the refresh token. Instead the cached access token is
	 * marked as expired, so the next request, also in a later command,
	 * refreshes it.
	 *
	 * @param {Error} error The expired-token error from the API
	 * @returns {Promise<never>} Bluebird promise rejecting with the given error
	 */
	handleExpiredTokensError(error) {
		this._forceRefresh = true;
		return BluebirdPromise.resolve(this._markCachedTokenExpired()).then(
			() => {
				throw error;
			}
		);
	}

	async _markCachedTokenExpired() {
		// A running refresh is about to write new tokens. Writing back the token read here
		// could overwrite them with the refresh token the refresh just used up.
		if (this._refreshPromise) {
			return;
		}
		try {
			const token = await this._auth.tokenStorage.get();
			// Only the token this command used was rejected. A different token means another
			// CLI process refreshed in the meantime, and its new refresh token must be kept.
			if (
				token?.accessToken &&
				token.refreshToken &&
				token.accessToken === this._token?.accessToken
			) {
				await this._auth.tokenStorage.store({
					accessToken: token.accessToken,
					refreshToken: token.refreshToken,
					expiresIn: 0,
				});
			}
		} catch (error) {
			// The API error is what the user needs to see, so a cache failure must not replace it.
			DEBUG.execute('Could not mark cached token as expired: %O', error);
		}
	}

	async _getValidToken() {
		if (!this._token) {
			const cachedToken = await this._auth.tokenStorage.get();
			if (!cachedToken?.accessToken) {
				throw createReauthorizeError(this._environmentName);
			}
			this._token = cachedToken;
		}
		if (!this._forceRefresh && !this._isExpired(this._token)) {
			return this._token;
		}
		return this._refresh();
	}

	_refresh() {
		if (!this._refreshPromise) {
			this._refreshPromise = this._refreshOnce().finally(() => {
				this._refreshPromise = null;
			});
		}
		return this._refreshPromise;
	}

	async _refreshOnce() {
		const tokenBeforeRefresh = await this._auth.tokenStorage.get();
		const usedRefreshToken = tokenBeforeRefresh?.refreshToken;
		try {
			const token = await this._auth.refreshToken(this._networkSession);
			return this._useToken({
				accessToken: token.accessToken,
				refreshToken: token.refreshToken,
				accessTokenTTLMS: token.expiresIn * 1000,
				acquiredAtMS: Date.now(),
			});
		} catch (error) {
			if (!isInvalidGrantError(error)) {
				throw error;
			}
			// A refresh token works once. If another CLI process refreshed first, its new tokens are in the cache.
			const latestToken = await this._auth.tokenStorage.get();
			if (
				latestToken?.accessToken &&
				latestToken.refreshToken !== usedRefreshToken &&
				!this._isExpired(latestToken)
			) {
				return this._useToken(latestToken);
			}
			throw createReauthorizeError(this._environmentName, error);
		}
	}

	_useToken(token) {
		this._token = token;
		this._forceRefresh = false;
		return token;
	}

	/**
	 * The CLI token cache stamps tokens with their acquisition time and TTL.
	 * A token without them cannot be dated, so it is refreshed.
	 *
	 * @param {Object} token Token read from the token cache
	 * @returns {boolean} True if the token must be refreshed before use
	 * @private
	 */
	_isExpired(token) {
		if (
			typeof token.acquiredAtMS !== 'number' ||
			typeof token.accessTokenTTLMS !== 'number'
		) {
			return true;
		}
		return (
			Date.now() + this._expiryBufferMS >=
			token.acquiredAtMS + token.accessTokenTTLMS
		);
	}
}

module.exports = PublicClientSessionAdapter;
