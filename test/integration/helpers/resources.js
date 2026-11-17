'use strict';

// The items a test creates in Box, all inside the folder of its test file, which after() deletes

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const { run, homeDirectory } = require('./cli');

function uniqueName(prefix = 'cli-it') {
	return `${prefix}-${crypto.randomUUID()}`;
}

/**
 * Create a cli-it- folder. Pass the folder of the test file as the parent;
 * pass '0' only for that folder itself, created in before and deleted in after.
 */
async function createFolder(parentId) {
	if (parentId === undefined) {
		throw new Error(
			"createFolder needs a parent folder ID; pass '0' only for the folder of a test file, which after() deletes"
		);
	}
	const { output } = await run(['folders:create', parentId, uniqueName()]);
	return output;
}

/**
 * Upload a small text file into a folder the test created and return the
 * file. It is deleted with that folder.
 */
async function uploadFile(
	parentId,
	{
		name = `${uniqueName()}.txt`,
		content = 'Box CLI integration test\n',
	} = {}
) {
	if (parentId === undefined || String(parentId) === '0') {
		throw new Error(
			"uploadFile needs the ID of a folder the test created, such as the folder from before; never '0'"
		);
	}
	if (/[/\\]/.test(name)) {
		throw new Error(`uploadFile needs a file name, not a path: ${name}`);
	}
	const dir = path.join(await homeDirectory(), 'uploads');
	fs.mkdirSync(dir, { recursive: true });
	const filePath = path.join(dir, name);
	fs.writeFileSync(filePath, content);
	try {
		const { output } = await run([
			'files:upload',
			filePath,
			'--parent-id',
			String(parentId),
		]);
		return output;
	} finally {
		fs.rmSync(filePath, { force: true });
	}
}

async function deleteFolder(id) {
	await run(['folders:delete', id, '--recursive', '--force'], {
		json: false,
	});
}

module.exports = {
	uniqueName,
	createFolder,
	uploadFile,
	deleteFolder,
};
