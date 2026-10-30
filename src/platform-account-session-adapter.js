'use strict';

const BluebirdPromise = require('bluebird');
const { createTokenExchangeNotSupportedError } = require('./platform-account');

/**
 * Legacy SDK session that obtains tokens from the generated SDK's
 * `BoxPlatformAccountAuth`, so commands still using the legacy `BoxClient`
 * work in Platform Account environments without a second implementation of
 * the auth protocol.
 *
 * The legacy client chains Bluebird-only methods (`asCallback`) on everything
 * a session returns, so every public method returns a Bluebird promise.
 */
class PlatformAccountSessionAdapter {
	/**
	 * @param {BoxPlatformAccountAuth} auth Generated SDK auth. Its token storage is shared with the generated SDK client.
	 * @param {Object} options Adapter options
	 * @param {number} options.expiryBufferMS Tokens expiring within this window are treated as expired
	 * @param {NetworkSession} options.networkSession Generated SDK network session used for token requests
	 */
	constructor(auth, { expiryBufferMS, networkSession }) {
		this._auth = auth;
		this._expiryBufferMS = expiryBufferMS;
		this._networkSession = networkSession;
		this._refreshPromise = null;
		this._issuedToken = null;
	}

	/**
	 * Get a valid access token, requesting a new one when the cached token is
	 * missing or about to expire.
	 *
	 * @returns {Promise<string>} Bluebird promise resolving to the access token
	 */
	getAccessToken() {
		return BluebirdPromise.resolve(this._getValidToken()).then(
			(token) => token.accessToken
		);
	}

	/**
	 * Revoke the current access token and remove it from the token cache.
	 *
	 * @returns {Promise<void>} Bluebird promise resolving when the token is revoked
	 */
	revokeTokens() {
		this._issuedToken = null;
		return BluebirdPromise.resolve(
			this._auth.revokeToken(this._networkSession)
		);
	}

	/**
	 * Platform Account tokens are bound to a fixed principal and cannot be
	 * downscoped or exchanged.
	 *
	 * @returns {Promise<never>} Bluebird promise that always rejects
	 */
	exchangeToken() {
		return BluebirdPromise.reject(createTokenExchangeNotSupportedError());
	}

	/**
	 * Called by the legacy client when the API rejects the token as expired.
	 * Clears the token cache so the next request gets a new token, then
	 * rethrows, matching the built-in legacy sessions.
	 *
	 * @param {Error} error The expired-token error from the API
	 * @returns {Promise<never>} Bluebird promise rejecting with the given error
	 */
	handleExpiredTokensError(error) {
		this._issuedToken = null;
		return BluebirdPromise.resolve(this._auth.tokenStorage.clear()).then(
			() => {
				throw error;
			}
		);
	}

	async _getValidToken() {
		const cachedToken = await this._auth.tokenStorage.get();
		if (cachedToken && !this._isExpired(cachedToken)) {
			return cachedToken;
		}
		return this._requestNewToken();
	}

	_requestNewToken() {
		if (!this._refreshPromise) {
			this._refreshPromise = Promise.resolve(
				this._auth.refreshToken(this._networkSession)
			)
				.then((token) => {
					this._issuedToken = {
						accessToken: token.accessToken,
						expiresAtMS: Date.now() + token.expiresIn * 1000,
					};
					return token;
				})
				.finally(() => {
					this._refreshPromise = null;
				});
		}
		return this._refreshPromise;
	}

	/**
	 * The CLI token cache stamps tokens with their acquisition time. Storages
	 * that keep only the raw token (in-memory storage when token caching is
	 * disabled) give no way to tell its age, so such a token is trusted only
	 * when this adapter requested it.
	 *
	 * @param {Object} token Token read from token storage
	 * @returns {boolean} True if the token must not be used
	 * @private
	 */
	_isExpired(token) {
		let expiresAtMS;
		if (
			typeof token.acquiredAtMS === 'number' &&
			typeof token.accessTokenTTLMS === 'number'
		) {
			expiresAtMS = token.acquiredAtMS + token.accessTokenTTLMS;
		} else if (this._issuedToken?.accessToken === token.accessToken) {
			expiresAtMS = this._issuedToken.expiresAtMS;
		} else {
			return true;
		}
		return Date.now() + this._expiryBufferMS >= expiresAtMS;
	}
}

module.exports = PlatformAccountSessionAdapter;
