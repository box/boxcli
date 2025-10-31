'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const TEST_API_ROOT = 'https://api.box.com';
const TEST_UPLOAD_ROOT = 'https://upload.box.com/api';
const TEST_DOWNLOAD_ROOT = 'https://dl.boxcloud.com';
const DEFAULT_DOWNLOAD_PATH = path.join(
	os.homedir(),
	'Downloads/Box-Downloads'
);

function isWin() {
	return process.platform === 'win32';
}

function getFixture(fixture) {
	if (!path.extname(fixture)) {
		fixture += '.json';
	}

	const content = fs.readFileSync(
		path.join(__dirname, '..', `fixtures/${fixture}`),
		'utf8'
	);

	if (isWin()) {
		let transformedContent = fixture.endsWith('table.txt')
			? content.replaceAll(/(?<!-)(?<!\r\n)\r(?!\n\r)/g, '')
			: content.replaceAll('\r', '');

		return transformedContent.trimEnd().concat(os.EOL);
	}

	return content;
}

function getProgressBar(message) {
	return process.stderr.isTTY ? message : '';
}

function getBulkProgressBar(size) {
	return getProgressBar(
		`[----------------------------------------] 0% | 0/${size}[========================================] 100% | ${size}/${size}\n`
	);
}

function getDownloadProgressBar(size) {
	return getProgressBar(
		`[----------------------------------------] 0% | ETA: 0s | 0/${size} | Speed: N/A MB/s[========================================] 100% | ETA: 0s | ${size}/${size} | Speed: N/A MB/s\n`
	);
}

function getDriveLetter() {
	return process.cwd().split('\\')[0];
}

function toUrlPath(filePath) {
	return isWin()
		? `/${filePath.replace(':', '').replaceAll('\\', '/')}`
		: filePath;
}

module.exports = {
	TEST_API_ROOT,
	TEST_UPLOAD_ROOT,
	TEST_DOWNLOAD_ROOT,
	DEFAULT_DOWNLOAD_PATH,
	getFixture,
	getBulkProgressBar,
	getDownloadProgressBar,
	getDriveLetter,
	isWin,
	toUrlPath,
};
