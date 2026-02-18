'use strict';

const { createHash, randomBytes } = require('node:crypto');

const MIN_PKCE_CODE_VERIFIER_LENGTH = 43;
const MAX_PKCE_CODE_VERIFIER_LENGTH = 128;

function toBase64Url(buffer) {
	return buffer
		.toString('base64')
		.replaceAll('+', '-')
		.replaceAll('/', '_')
		.replace(/=+$/u, '');
}

function generatePKCE(verifierLength = MAX_PKCE_CODE_VERIFIER_LENGTH) {
	if (
		!Number.isInteger(verifierLength) ||
		verifierLength < MIN_PKCE_CODE_VERIFIER_LENGTH ||
		verifierLength > MAX_PKCE_CODE_VERIFIER_LENGTH
	) {
		throw new RangeError(
			`PKCE code verifier length must be an integer in range ${MIN_PKCE_CODE_VERIFIER_LENGTH}-${MAX_PKCE_CODE_VERIFIER_LENGTH}.`
		);
	}

	// Generate enough entropy and trim to requested PKCE verifier length.
	const codeVerifier = toBase64Url(randomBytes(verifierLength)).slice(
		0,
		verifierLength
	);
	const codeChallenge = toBase64Url(
		createHash('sha256').update(codeVerifier).digest()
	);

	return { codeVerifier, codeChallenge };
}

module.exports = {
	MIN_PKCE_CODE_VERIFIER_LENGTH,
	MAX_PKCE_CODE_VERIFIER_LENGTH,
	toBase64Url,
	generatePKCE,
};
