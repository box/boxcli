'use strict';

const { assert } = require('chai');
const { run, createFolder, deleteFolder, cleanup } = require('../helpers');

describe('Integration: collections', function () {
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

	it('collections:get returns the Favorites collection and its items', async function () {
		const { output: collections } = await run(['collections']);
		const { output: favorites } = await run([
			'collections:get',
			collections[0].id,
		]);
		assert.equal(favorites.type, 'collection');
		assert.equal(favorites.collection_type, 'favorites');
		assert.equal(favorites.id, collections[0].id);

		await run(['collections:items', favorites.id]);

		const child = await createFolder(folder.id);
		await run(['collections:add', 'folder', child.id, favorites.id], {
			json: false,
		});

		const { output: items } = await run([
			'collections:items',
			favorites.id,
		]);
		assert.isTrue(
			items.some((item) => item.type === 'folder' && item.id === child.id)
		);

		await run(['collections:remove', 'folder', child.id, favorites.id], {
			json: false,
		});
	});
});
