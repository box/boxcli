'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const leche = require('leche');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Trash', () => {

	describe('trash:delete', () => {
		let itemId = '1234';

		leche.withData({
			'file argument': ['file'],
			'folder argument': ['folder'],
			'web link argument': ['web_link'],
		}, function(itemType) {

			test
				.nock(TEST_API_ROOT, api => api
					.delete(`/2.0/${itemType}s/${itemId}/trash`)
					.reply(204)
				)
				.stderr()
				.command([
					'trash:delete',
					itemType,
					itemId,
					'--token=test'
				])
				.it('should permanently delete an item', ctx => {
					assert.equal(ctx.stderr, `Deleted item ${itemId}${os.EOL}`);
				});
		});
	});

	leche.withData([
		'trash',
		'trash:list'
	], function(command) {

		describe(command, () => {
			let fixture = getFixture('trash/get_trashed_items_page_1'),
				fixture2 = getFixture('trash/get_trashed_items_page_2'),
				jsonOutput = getFixture('output/trash_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/folders/trash/items')
					.reply(200, fixture)
					.get('/2.0/folders/trash/items')
					.query({
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					'--json',
					'--token=test'
				])
				.it('should list all items in trash (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/folders/trash/items')
					.query({fields: 'name'})
					.reply(200, fixture)
					.get('/2.0/folders/trash/items')
					.query({
						fields: 'name',
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					'--fields=name',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fiels flag is passed');
		});
	});

	describe('trash:get', () => {
		let fixture = getFixture('trash/get_web_links_id_trash');
		let itemId = '1234';

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/${itemType}s/${itemId}/trash`)
				.reply(200, fixture)
			)
			.stderr()
			.command([
				'trash:get',
				'web_link',
				itemId,
				'--token=test'
			])
			.it('should get information on a web link in trash', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});
});
