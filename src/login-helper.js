'use strict';

const BoxCLIError = require('./cli-error');

function assertValidOAuthCode(code) {
	if (typeof code !== 'string' || code.length === 0) {
		throw new BoxCLIError(
			`Invalid OAuth code received in callback. Got "${code}"`
		);
	}
}

async function getTokenInfoWithPKCE(sdk, code, redirectUri, codeVerifier) {
	if (!sdk?.tokenManager?.getTokens) {
		throw new BoxCLIError(
			'OAuth token manager is unavailable; unable to complete PKCE token exchange.'
		);
	}

	try {
		return await sdk.tokenManager.getTokens(
			{
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri,
				code_verifier: codeVerifier,
			},
			null
		);
	} catch (error) {
		throw new BoxCLIError('Failed to exchange auth code with PKCE.', error);
	}
}

module.exports = {
	assertValidOAuthCode,
	getTokenInfoWithPKCE,
};
