'use strict';

const BoxTSSDK = require('box-node-sdk/sdk-gen');
const BoxCLIError = require('./cli-error');
const pkg = require('../package.json');

const SDK_AUTHORIZE_ROOT_URL = 'https://account.box.com/api';

/**
 * Check whether a CLI environment authenticates as an OAuth 2.0 public client (PKCE, no client secret)
 *
 * @param {Object} [environment] A CLI environment
 * @returns {boolean} True for public client environments
 */
function isPublicClientEnvironment(environment) {
	return (
		environment?.authMethod === 'oauth20' && environment.publicClient === true
	);
}

/**
 * Build the generated SDK public client auth.
 *
 * @param {Object} options Options
 * @param {string} options.clientId Client ID of the public client app
 * @param {TokenStorage} [options.tokenStorage] Token storage, in-memory if not given
 * @returns {BoxTSSDK.BoxPublicClientOAuth} The public client auth
 */
function createPublicClientAuth({ clientId, tokenStorage }) {
	const config = new BoxTSSDK.PublicOAuthConfig({
		clientId,
		...(tokenStorage ? { tokenStorage } : {}),
	});
	return new BoxTSSDK.BoxPublicClientOAuth({ config });
}

/**
 * Build the public client auth and a TS SDK client that uses it, configured with
 * the command's settings (proxy, base URLs, analytics header).
 *
 * @param {BoxCommand} command The command, whose `_configureTsSdk` applies the CLI settings
 * @param {Object} options Options
 * @param {string} options.clientId Client ID of the public client app
 * @param {TokenStorage} [options.tokenStorage] Token storage, in-memory if not given
 * @returns {{auth: BoxTSSDK.BoxPublicClientOAuth, client: BoxTSSDK.BoxClient}} The auth and the configured client
 */
function createPublicClientTsClient(command, { clientId, tokenStorage }) {
	const auth = createPublicClientAuth({ clientId, tokenStorage });
	// _configureTsSdk adds headers to the config it gets, so every client needs its own.
	const client = command._configureTsSdk(new BoxTSSDK.BoxClient({ auth }), {
		request: { headers: { 'User-Agent': `Box CLI v${pkg.version}` } },
	});
	return { auth, client };
}

/**
 * Build the authorize URL for a public client login, honoring the authorizeRootURL setting.
 *
 * @param {BoxTSSDK.BoxPublicClientOAuth} auth The public client auth. Stores the PKCE code verifier for the state.
 * @param {Object} options Options
 * @param {string} options.redirectUri Redirect URI registered for the app
 * @param {string} options.state OAuth state
 * @param {string} [options.authorizeRootURL] Custom authorize root URL from CLI settings
 * @returns {Promise<string>} The authorize URL
 */
async function getPublicClientAuthorizeUrl(
	auth,
	{ redirectUri, state, authorizeRootURL }
) {
	const url = await auth.getAuthorizeUrl({ redirectUri, state });
	if (!authorizeRootURL || !url.startsWith(SDK_AUTHORIZE_ROOT_URL)) {
		return url;
	}
	return `${authorizeRootURL.replace(/\/+$/u, '')}${url.slice(SDK_AUTHORIZE_ROOT_URL.length)}`;
}

/**
 * Error for a public client environment whose tokens are missing or can no longer be refreshed.
 *
 * @param {string} environmentName Name of the environment
 * @param {Error} [cause] The underlying error
 * @returns {BoxCLIError} The error to throw
 */
function createReauthorizeError(environmentName, cause) {
	const reason = cause
		? 'Your refresh token has expired or was revoked.'
		: `No tokens are cached for environment "${environmentName}".`;
	return new BoxCLIError(
		`${reason}\nPlease run "box login --name ${environmentName} --reauthorize" to reauthorize the environment and then run your command again.`,
		cause
	);
}

/**
 * Whether an error from the generated SDK is the OAuth `invalid_grant` error,
 * which the token endpoint returns for an expired or revoked refresh token.
 *
 * @param {Error} error The error
 * @returns {boolean} True for invalid_grant errors
 */
function isInvalidGrantError(error) {
	return error?.responseInfo?.body?.error === 'invalid_grant';
}

/**
 * Whether an error from the generated SDK means the refresh token was rejected:
 * `invalid_grant` from a `grant_type=refresh_token` request. Other token requests,
 * such as downscoping, can also return `invalid_grant` for unrelated reasons.
 *
 * @param {Error} error The error
 * @returns {boolean} True if the refresh token is expired or revoked
 */
function isRefreshTokenRejectedError(error) {
	if (!isInvalidGrantError(error)) {
		return false;
	}
	const requestBody = error.requestInfo?.body;
	return (
		typeof requestBody === 'string' &&
		new URLSearchParams(requestBody).get('grant_type') === 'refresh_token'
	);
}

module.exports = {
	isPublicClientEnvironment,
	createPublicClientAuth,
	createPublicClientTsClient,
	getPublicClientAuthorizeUrl,
	createReauthorizeError,
	isInvalidGrantError,
	isRefreshTokenRejectedError,
};
