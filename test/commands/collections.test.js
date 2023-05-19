'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');
const leche = require('leche');

describe('Collections', () => {

	describe('collections', () => {
		let fixture = getFixture('collections/get_collections'),
			jsonOutput = getFixture('output/collections_get_json.txt'),
			tableOutput = getFixture('output/collections_get_table.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/collections')
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collections',
				'--json',
				'--token=test'
			])
			.it('should get your collections (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/collections')
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collections',
				'--token=test'
			])
			.it('should get your collections (Table Output)', ctx => {
				assert.equal(ctx.stdout, tableOutput);
			});
	});

	describe('collections:items', () => {
		let collectionId = '1234567890',
			fixture = getFixture('collections/get_collections_id_items_page_1'),
			fixture2 = getFixture('collections/get_collections_id_items_page_2'),
			jsonOutput = getFixture('output/collections_list_items_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collections/${collectionId}/items`)
				.query({limit: 1000})
				.reply(200, fixture)
				.get(`/2.0/collections/${collectionId}/items`)
				.query({
					offset: 2,
					limit: 1000
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'collections:items',
				collectionId,
				'--json',
				'--token=test'
			])
			.it('should get items in a collection (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collections/${collectionId}/items`)
				.query({fields: 'name', limit: 1000})
				.reply(200, fixture)
				.get(`/2.0/collections/${collectionId}/items`)
				.query({
					fields: 'name',
					offset: 2,
					limit: 1000
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'collections:items',
				collectionId,
				'--fields=name',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('collections:remove', () => {
		let itemType = 'file',
			fileId = '1234567890',
			collectionId = '1234567890',
			getFileFixture = getFixture('collections/get_files_id'),
			updatedFileFixture = getFixture('collections/put_files_id');

		let expectedBody = {
			collections: []
		};

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.query({
					fields: 'collections'
				})
				.reply(200, getFileFixture)
				.put(`/2.0/files/${fileId}`, expectedBody)
				.reply(200, updatedFileFixture)
			)
			.stdout()
			.stderr()
			.command([
				'collections:remove',
				itemType,
				fileId,
				collectionId,
				'--json',
				'--no-color',
				'--token=test'
			])
			.it('should remove an item from a collection', ctx => {
				assert.equal(ctx.stdout, '');
				assert.equal(ctx.stderr, `Removed file "test_file_download.txt" from collection ${collectionId}${os.EOL}`);
			});
	});

	describe('collections:add', () => {
		let itemID = '1234567890',
			collectionId = '1234567890',
			getFileFixture = getFixture('collections/get_files_id'),
			updatedFileFixture = getFixture('collections/put_files_id');

		let expectedBody = {
			collections: [{ id: collectionId }]
		};

		leche.withData({
			file: [ 'file' ],
			folder: [ 'folder' ],
			'web link': [ 'web_link' ],
		}, function(itemType) {

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/${itemType}s/${itemID}`)
					.query({
						fields: 'collections'
					})
					.reply(200, getFileFixture)
					.put(`/2.0/${itemType}s/${itemID}`, expectedBody)
					.reply(200, updatedFileFixture)
				)
				.stdout()
				.stderr()
				.command([
					'collections:add',
					itemType,
					itemID,
					collectionId,
					'--json',
					'--token=test'
				])
				.it('should add an item to a collection (JSON Output)', ctx => {
					assert.equal(ctx.stdout, '');
					assert.equal(ctx.stderr, `Added ${itemType} "test_file_download.txt" to collection ${collectionId}${os.EOL}`);
				});
		});
	});
});
