'use strict';

const { assert } = require('chai');
const {
	run,
	expectFailure,
	uniqueName,
	createFolder,
	uploadFile,
	deleteFolder,
	cleanup,
} = require('../helpers');

describe('Integration: folders', function () {
	let folder;

	before(async function () {
		folder = await createFolder('0');
	});

	after(async function () {
		try {
			if (folder) {
				await deleteFolder(folder.id);
			}
		} finally {
			cleanup();
		}
	});

	it('folders:create creates a subfolder', async function () {
		const name = uniqueName();
		const { output } = await run(['folders:create', folder.id, name]);
		assert.equal(output.type, 'folder');
		assert.equal(output.name, name);
		assert.equal(output.parent.id, folder.id);
	});

	it('folders:get returns the created folder', async function () {
		const { output } = await run(['folders:get', folder.id]);
		assert.equal(output.type, 'folder');
		assert.equal(output.id, folder.id);
		assert.equal(output.name, folder.name);
	});

	it('folders:update changes the name and description', async function () {
		const child = await createFolder(folder.id);
		const name = uniqueName();
		const { output } = await run([
			'folders:update',
			child.id,
			'--name',
			name,
			'--description',
			'Box CLI integration test',
		]);
		assert.equal(output.id, child.id);
		assert.equal(output.name, name);
		assert.equal(output.description, 'Box CLI integration test');

		const { output: stored } = await run([
			'folders:get',
			child.id,
			'--fields',
			'name,description',
		]);
		assert.equal(stored.name, name);
		assert.equal(stored.description, 'Box CLI integration test');
	});

	it('folders:items lists a subfolder and a file', async function () {
		const child = await createFolder(folder.id);
		const file = await uploadFile(folder.id);
		const { output } = await run(['folders:items', folder.id]);
		assert.isTrue(
			output.some(
				(item) => item.type === 'folder' && item.id === child.id
			)
		);
		assert.isTrue(
			output.some((item) => item.type === 'file' && item.id === file.id)
		);
	});

	it('folders:delete deletes a folder permanently', async function () {
		const doomed = await createFolder(folder.id);
		await run(['folders:delete', doomed.id, '--force'], { json: false });

		await expectFailure(['folders:get', doomed.id], { status: 404 });
	});
});
