'use strict';

const { assert } = require('chai');
const { createHash } = require('node:crypto');
const {
	MIN_PKCE_CODE_VERIFIER_LENGTH,
	MAX_PKCE_CODE_VERIFIER_LENGTH,
	toBase64Url,
	generatePKCE,
} = require('../src/pkce-support');

describe('PKCE Support', function () {
	describe('toBase64Url', function () {
		it('should convert base64 into URL-safe format without padding', function () {
			const result = toBase64Url(Buffer.from([251, 239, 255]));
			assert.equal(result, '--__');
		});
	});

	describe('generatePKCE', function () {
		it('should default verifier length to max supported value', function () {
			const pkce = generatePKCE();
			assert.lengthOf(pkce.codeVerifier, MAX_PKCE_CODE_VERIFIER_LENGTH);
			assert.match(pkce.codeVerifier, /^[A-Za-z0-9_-]+$/u);
		});

		for (const { name, length } of [
			{ name: 'min', length: MIN_PKCE_CODE_VERIFIER_LENGTH },
			{
				name: 'mid',
				length: Math.floor(
					(MIN_PKCE_CODE_VERIFIER_LENGTH +
						MAX_PKCE_CODE_VERIFIER_LENGTH) /
						2
				),
			},
			{ name: 'max', length: MAX_PKCE_CODE_VERIFIER_LENGTH },
		]) {
			it(`should generate valid verifier and challenge for ${name} length`, function () {
				const pkce = generatePKCE(length);
				assert.lengthOf(pkce.codeVerifier, length);
				assert.match(pkce.codeVerifier, /^[A-Za-z0-9_-]+$/u);
				assert.equal(
					pkce.codeChallenge,
					toBase64Url(
						createHash('sha256').update(pkce.codeVerifier).digest()
					)
				);
			});
		}

		it('should derive codeChallenge from generated codeVerifier (S256)', function () {
			const { codeVerifier, codeChallenge } = generatePKCE(64);
			const expectedChallenge = toBase64Url(
				createHash('sha256').update(codeVerifier).digest()
			);
			assert.equal(codeChallenge, expectedChallenge);
		});

		for (const { name, length } of [
			{ name: 'below minimum', length: 42 },
			{ name: 'above maximum', length: 129 },
			{ name: 'non-integer', length: 43.5 },
		]) {
			it(`should throw for ${name} verifier length`, function () {
				assert.throws(
					() => generatePKCE(length),
					/PKCE code verifier length must be an integer in range 43-128/u
				);
			});
		}
	});
});
