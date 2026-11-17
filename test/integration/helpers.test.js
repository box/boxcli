'use strict';

const { assert } = require('chai');
const {
	run,
	statusOf,
	redact,
	expectFailure,
	uploadFile,
	createFolder,
	userId,
	adminUserId,
	enterpriseId,
	enterpriseScope,
	waitFor,
} = require('./helpers');

describe('Integration test helpers', function () {
	describe('statusOf', function () {
		it('reads the HTTP status of an API error', function () {
			assert.equal(
				statusOf(
					'Unexpected API Response [404 Not Found | abc123] not_found - Not Found'
				),
				404
			);
			assert.equal(
				statusOf(
					'Unexpected API Response [409 Conflict | x] item_name_in_use'
				),
				409
			);
		});

		it('reads it after other messages, without a response body, and in color', function () {
			assert.equal(
				statusOf(
					'Expired Auth: Auth code or refresh token has expired [401 Unauthorized | a.b]'
				),
				401
			);
			assert.equal(
				statusOf('Download not ready at this time [202 Accepted]'),
				202
			);
			assert.equal(
				statusOf('404 not_found Not Found; Request ID: abc'),
				404
			);
			assert.equal(
				statusOf(
					'\u001B[91mUnexpected API Response [403 Forbidden | x] access_denied\u001B[39m'
				),
				403
			);
		});

		it('returns null for an error without one', function () {
			assert.isNull(statusOf('File not found: ./missing.txt'));
			assert.isNull(statusOf(''));
		});
	});

	describe('redact', function () {
		it('masks tokens, keys, PEM blocks and e-mail addresses', function () {
			const text = redact(
				'Bearer abc.def {"access_token":"t1","privateKey":"k"} eyJa.eyJb.c2ln ' +
					'-----BEGIN PRIVATE KEY-----\nMII\n-----END PRIVATE KEY----- me@example.com'
			);
			assert.equal(
				text,
				'Bearer <token> {"access_token":"<redacted>","privateKey":"<redacted>"} <jwt> <pem> <email>'
			);
		});
	});

	describe('test account', function () {
		const names = ['USER_ID', 'ADMIN_USER_ID', 'ENTERPRISE_ID'];
		let saved;

		beforeEach(function () {
			saved = Object.fromEntries(
				names.map((name) => [name, process.env[name]])
			);
		});

		afterEach(function () {
			for (const name of names) {
				if (saved[name] === undefined) {
					delete process.env[name];
				} else {
					process.env[name] = saved[name];
				}
			}
		});

		it('reads the IDs from the environment', function () {
			process.env.USER_ID = '11';
			process.env.ADMIN_USER_ID = '22';
			process.env.ENTERPRISE_ID = '33';
			assert.equal(userId(), '11');
			assert.equal(adminUserId(), '22');
			assert.equal(enterpriseId(), '33');
			assert.equal(enterpriseScope(), 'enterprise_33');
		});

		it('names the missing variable instead of guessing', function () {
			for (const name of names) {
				delete process.env[name];
			}
			assert.throws(() => userId(), /USER_ID is not set/);
			assert.throws(() => adminUserId(), /ADMIN_USER_ID is not set/);
			assert.throws(() => enterpriseScope(), /ENTERPRISE_ID is not set/);
		});

		it('run acts as one identity at a time and needs its ID', async function () {
			delete process.env.USER_ID;
			const both = await run(['users:get'], {
				asUser: true,
				asAdmin: true,
			}).catch((error_) => error_);
			assert.instanceOf(both, TypeError);
			const missing = await run(['users:get'], { asUser: true }).catch(
				(error_) => error_
			);
			assert.match(missing.message, /USER_ID is not set/);
		});
	});

	describe('waitFor', function () {
		it('returns the first truthy result, also after a check that threw', async function () {
			let calls = 0;
			const value = await waitFor(
				() => {
					calls += 1;
					if (calls === 1) {
						throw new Error('not there yet');
					}
					return calls === 3 ? 'ready' : null;
				},
				{ timeoutSeconds: 5, intervalSeconds: 0.01 }
			);
			assert.equal(value, 'ready');
			assert.equal(calls, 3);
		});

		it('rethrows the last error when the time is up', async function () {
			const error = await waitFor(
				() => {
					throw new Error('still missing');
				},
				{ timeoutSeconds: 0.05, intervalSeconds: 0.01 }
			).catch((error_) => error_);
			assert.equal(error.message, 'still missing');
		});

		it('fails when the condition stays false, and refuses waits longer than a test may run', async function () {
			const error = await waitFor(() => false, {
				timeoutSeconds: 0.05,
				intervalSeconds: 0.01,
			}).catch((error_) => error_);
			assert.match(error.message, /condition was not met in 0.05 s/);
			const tooLong = await waitFor(() => true, {
				timeoutSeconds: 600,
			}).catch((error_) => error_);
			assert.instanceOf(tooLong, RangeError);
		});
	});

	describe('misuse is refused before any call', function () {
		it('expectFailure needs the expected status', async function () {
			const error = await expectFailure(['folders:get', '1']).catch(
				(error_) => error_
			);
			assert.instanceOf(error, TypeError);
			assert.match(error.message, /needs the expected HTTP status/);
		});

		it('uploadFile needs a folder the test created and a plain file name', async function () {
			for (const parentId of [undefined, '0', 0]) {
				const error = await uploadFile(parentId).catch(
					(error_) => error_
				);
				assert.match(
					error.message,
					/needs the ID of a folder the test created/
				);
			}
			const error = await uploadFile('123', { name: '../x.txt' }).catch(
				(error_) => error_
			);
			assert.match(error.message, /needs a file name, not a path/);
		});

		it('createFolder needs a parent', async function () {
			const error = await createFolder().catch((error_) => error_);
			assert.match(error.message, /needs a parent folder ID/);
		});
	});
});
