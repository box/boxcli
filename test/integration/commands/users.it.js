'use strict';

const { assert } = require('chai');
const { run, userId, adminUserId, cleanup } = require('../helpers');

// Many box-node-sdk tests act as USER_ID; the CLI does it through the As-User header, which these cases check
describe('Integration: users', function () {
	after(function () {
		cleanup();
	});

	it('users:get acts as USER_ID with asUser', async function () {
		const { output } = await run(['users:get'], { asUser: true });
		assert.equal(output.type, 'user');
		assert.equal(output.id, userId());
	});

	it('users:get acts as ADMIN_USER_ID with asAdmin', async function () {
		const { output } = await run(['users:get'], { asAdmin: true });
		assert.equal(output.type, 'user');
		assert.equal(output.id, adminUserId());
	});
});
