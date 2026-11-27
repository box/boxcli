'use strict';

// The shared test account, from the environment of the test run. The same variables as the box-node-sdk integration
// tests, so a test can follow an SDK test without guessing an ID.

const VARIABLES = {
	USER_ID:
		'a managed user of the test enterprise, the user the box-node-sdk tests act as',
	ADMIN_USER_ID: 'the admin user of the test enterprise',
	ENTERPRISE_ID: 'the ID of the test enterprise',
};

function variable(name) {
	const value = process.env[name];
	if (!value) {
		throw new Error(
			`${name} is not set; integration tests need ${VARIABLES[name]}`
		);
	}

	return value;
}

const userId = () => variable('USER_ID');
const adminUserId = () => variable('ADMIN_USER_ID');
const enterpriseId = () => variable('ENTERPRISE_ID');
// The scope of the test enterprise's metadata templates and taxonomies, such as enterprise_123
const enterpriseScope = () => `enterprise_${enterpriseId()}`;

module.exports = { userId, adminUserId, enterpriseId, enterpriseScope };
