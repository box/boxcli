'use strict';

// The helpers integration tests use: require('../helpers') from test/integration/commands/<topic>.it.js

const { run, expectFailure, cleanup, redact, statusOf } = require('./cli');
const {
	uniqueName,
	createFolder,
	uploadFile,
	deleteFolder,
} = require('./resources');
const {
	userId,
	adminUserId,
	enterpriseId,
	enterpriseScope,
} = require('./account');
const { waitFor } = require('./wait');

module.exports = {
	run,
	expectFailure,
	uniqueName,
	createFolder,
	uploadFile,
	deleteFolder,
	userId,
	adminUserId,
	enterpriseId,
	enterpriseScope,
	waitFor,
	cleanup,
	redact,
	statusOf,
};
