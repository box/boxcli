'use strict';

const BoxCLIError = require('./cli-error');

function assertValidOAuthCode(code) {
	if (typeof code !== 'string' || code.length === 0) {
		throw new BoxCLIError(
			`Invalid OAuth code received in callback. Got "${code}"`
		);
	}
}

async function getTokenInfoByAuthCode(sdk, code, redirectUri, codeVerifier) {
	if (!sdk?.tokenManager?.getTokens) {
		throw new BoxCLIError(
			'OAuth token manager is unavailable; unable to complete token exchange.'
		);
	}

	try {
		const grantPayload = {
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
		};
		if (codeVerifier) {
			grantPayload.code_verifier = codeVerifier;
		}

		return await sdk.tokenManager.getTokens(grantPayload, null);
	} catch (error) {
		throw new BoxCLIError(
			'Failed to exchange auth code for tokens.',
			error
		);
	}
}

module.exports = {
	assertValidOAuthCode,
	getTokenInfoByAuthCode,
};
