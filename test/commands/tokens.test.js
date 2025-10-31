'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const jwt = require('jsonwebtoken');
const { TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Tokens', () => {
	const TEST_ACCESS_TOKEN = 'alksudiquwdajnsfisdfgsdfg';

	// @TODO(2018-12-13): Un-skip when tests can have a config set up
	describe.skip('tokens:get', () => {
		const userID = '98764';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/oauth2/token', (body) => {
					assert.propertyVal(
						body,
						'grant_type',
						'urn:ietf:params:oauth:grant-type:jwt-bearer'
					);
					assert.property(body, 'assertion');

					let parsedJWT = jwt.decode(body.assertion, {
						complete: true,
					});
					assert.nestedPropertyVal(
						parsedJWT,
						'payload.box_sub_type',
						'enterprise'
					);
					return true;
				})
				.reply(200, {
					access_token: TEST_ACCESS_TOKEN,
					expires_in: 256,
				})
		)
			.stdout()
			.command(['tokens:get'])
			.it(
				'should output token for service account when called without flags',
				(ctx) => {
					assert.equal(ctx.stdout, `${TEST_ACCESS_TOKEN}${os.EOL}`);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/oauth2/token', (body) => {
					assert.propertyVal(
						body,
						'grant_type',
						'urn:ietf:params:oauth:grant-type:jwt-bearer'
					);
					assert.property(body, 'assertion');

					let parsedJWT = jwt.decode(body.assertion, {
						complete: true,
					});
					assert.nestedPropertyVal(
						parsedJWT,
						'payload.box_sub_type',
						'user'
					);
					assert.nestedPropertyVal(parsedJWT, 'payload.sub', userID);
					return true;
				})
				.reply(200, {
					access_token: TEST_ACCESS_TOKEN,
					expires_in: 256,
				})
		)
			.stdout()
			.command(['tokens:get', `--user-id=${userID}`])
			.it(
				'should output token for user when called with --user-id flag',
				(ctx) => {
					assert.equal(ctx.stdout, `${TEST_ACCESS_TOKEN}${os.EOL}`);
				}
			);
	});

	// @TODO(2018-12-13): Un-skip when tests can have a config set up
	describe.skip('tokens:revoke', () => {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/oauth2/revoke', (body) => {
					assert.propertyVal(body, 'token', TEST_ACCESS_TOKEN);
					return true;
				})
				.reply(200)
		)
			.stdout()
			.stderr()
			.command(['tokens:revoke', TEST_ACCESS_TOKEN])
			.it('should revoke token when called', (ctx) => {
				assert.equal(ctx.stderr, `Token revoked.${os.EOL}`);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/oauth2/revoke', (body) => {
					assert.propertyVal(body, 'token', TEST_ACCESS_TOKEN);
					return true;
				})
				.reply(400, {
					error: 'invalid_token',
					error_description: 'The supplied token is invalid',
				})
		)
			.stdout()
			.stderr()
			.command(['tokens:revoke', TEST_ACCESS_TOKEN])
			.it(
				'should output error message when token revocation fails',
				(ctx) => {
					assert.equal(
						ctx.stderr,
						`Error revoking token!  The supplied token is invalid${os.EOL}`
					);
				}
			);
	});

	// @TODO(2018-12-13): Un-skip when tests can have a config set up
	describe.skip('tokens:exchange', () => {
		let scopes = ['item_preview', 'user_view'];

		const itemID = '12345';
		const userID = '87645';
		const downscopedToken = 'ppuipoierhkjbdkjbsdfg';

		let expectedBody = {
			subject_token: TEST_ACCESS_TOKEN,
			subject_token_type: 'urn:ietf:params:oauth:token-type:access_token',
			scope: scopes.join(' '),
			grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
		};

		test.skip()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/token', (body) => {
						assert.propertyVal(
							body,
							'grant_type',
							'urn:ietf:params:oauth:grant-type:jwt-bearer'
						);
						assert.property(body, 'assertion');

						let parsedJWT = jwt.decode(body.assertion, {
							complete: true,
						});
						assert.nestedPropertyVal(
							parsedJWT,
							'payload.box_sub_type',
							'enterprise'
						);
						return true;
					})
					.reply(200, {
						access_token: TEST_ACCESS_TOKEN,
						expires_in: 256,
					})
					.post('/oauth2/token', (body) => {
						assert.include(body, expectedBody);
						return true;
					})
					.reply(200, {
						access_token: downscopedToken,
						expires_in: 256,
					})
			)
			.stdout()
			.command(['tokens:exchange', scopes.join(',')])
			.it('should exchange token for one with lower scope', (ctx) => {
				assert.equal(ctx.stdout, `${downscopedToken}${os.EOL}`);
			});

		test.skip()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/token', (body) => {
						assert.propertyVal(
							body,
							'grant_type',
							'urn:ietf:params:oauth:grant-type:jwt-bearer'
						);
						assert.property(body, 'assertion');

						let parsedJWT = jwt.decode(body.assertion, {
							complete: true,
						});
						assert.nestedPropertyVal(
							parsedJWT,
							'payload.box_sub_type',
							'enterprise'
						);
						return true;
					})
					.reply(200, {
						access_token: TEST_ACCESS_TOKEN,
						expires_in: 256,
					})
					.post('/oauth2/token', (body) => {
						assert.include(body, expectedBody);
						assert.propertyVal(
							body,
							'resource',
							`https://api.box.com/2.0/files/${itemID}`
						);
						return true;
					})
					.reply(200, {
						access_token: downscopedToken,
						expires_in: 256,
					})
			)
			.stdout()
			.command([
				'tokens:exchange',
				scopes.join(','),
				`--file-id=${itemID}`,
			])
			.it(
				'should restrict downscoped token to file resource when passed file ID',
				(ctx) => {
					assert.equal(ctx.stdout, `${downscopedToken}${os.EOL}`);
				}
			);

		test.skip()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/token', (body) => {
						assert.propertyVal(
							body,
							'grant_type',
							'urn:ietf:params:oauth:grant-type:jwt-bearer'
						);
						assert.property(body, 'assertion');

						let parsedJWT = jwt.decode(body.assertion, {
							complete: true,
						});
						assert.nestedPropertyVal(
							parsedJWT,
							'payload.box_sub_type',
							'enterprise'
						);
						return true;
					})
					.reply(200, {
						access_token: TEST_ACCESS_TOKEN,
						expires_in: 256,
					})
					.post('/oauth2/token', (body) => {
						assert.include(body, expectedBody);
						assert.propertyVal(
							body,
							'resource',
							`https://api.box.com/2.0/folders/${itemID}`
						);
						return true;
					})
					.reply(200, {
						access_token: downscopedToken,
						expires_in: 256,
					})
			)
			.stdout()
			.command([
				'tokens:exchange',
				scopes.join(','),
				`--folder-id=${itemID}`,
			])
			.it(
				'should restrict downscoped token to folder resource when passed folder ID',
				(ctx) => {
					assert.equal(ctx.stdout, `${downscopedToken}${os.EOL}`);
				}
			);

		test.skip()
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/oauth2/token', (body) => {
						assert.propertyVal(
							body,
							'grant_type',
							'urn:ietf:params:oauth:grant-type:jwt-bearer'
						);
						assert.property(body, 'assertion');

						let parsedJWT = jwt.decode(body.assertion, {
							complete: true,
						});
						assert.nestedPropertyVal(
							parsedJWT,
							'payload.box_sub_type',
							'user'
						);
						assert.nestedPropertyVal(
							parsedJWT,
							'payload.sub',
							userID
						);
						return true;
					})
					.reply(200, {
						access_token: TEST_ACCESS_TOKEN,
						expires_in: 256,
					})
					.post('/oauth2/token', (body) => {
						assert.include(body, expectedBody);
						return true;
					})
					.reply(200, {
						access_token: downscopedToken,
						expires_in: 256,
					})
			)
			.stdout()
			.command([
				'tokens:exchange',
				scopes.join(','),
				`--user-id=${userID}`,
			])
			.it(
				'should return token for user when passed --user-id flag',
				(ctx) => {
					assert.equal(ctx.stdout, `${downscopedToken}${os.EOL}`);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/oauth2/token', (body) => {
					assert.include(body, expectedBody);
					return true;
				})
				.reply(200, {
					access_token: downscopedToken,
					expires_in: 256,
				})
		)
			.stdout()
			.command([
				'tokens:exchange',
				scopes.join(','),
				`--token=${TEST_ACCESS_TOKEN}`,
			])
			.it(
				'should exchange specified token when --token flag is passed',
				(ctx) => {
					assert.equal(ctx.stdout, `${downscopedToken}\n`);
				}
			);
	});
});
