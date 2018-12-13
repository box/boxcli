'use strict';

const fs = require('fs');
const path = require('path');

const TEST_API_ROOT = 'https://api.box.com';
const TEST_UPLOAD_ROOT = 'https://upload.box.com/api';
const TEST_DOWNLOAD_ROOT = 'https://dl.boxcloud.com';

function getFixture(fixture) {
	if (!path.extname(fixture)) {
		fixture += '.json';
	}
	/* eslint-disable no-sync */
	return fs.readFileSync(path.join(__dirname, '..', `fixtures/${fixture}`), 'utf8');
	/* eslint-enable no-sync */
}

module.exports = {
	TEST_API_ROOT,
	TEST_UPLOAD_ROOT,
	TEST_DOWNLOAD_ROOT,
	getFixture,
};
