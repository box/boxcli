'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const leche = require('leche');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');

describe('Trash', function () {
	describe('trash:delete', function () {
		let itemId = '1234';

		leche.withData(
			{
				'file argument': ['file'],
				'folder argument': ['folder'],
				'web link argument': ['web_link'],
			},
			function (itemType) {
				test.nock(TEST_API_ROOT, (api) =>
					api.delete(`/2.0/${itemType}s/${itemId}/trash`).reply(204)
				)
					.stderr()
					.command(['trash:delete', itemType, itemId, '--token=test'])
					.it('should permanently delete an item', (context) => {
						assert.equal(
							context.stderr,
							`Deleted item ${itemId}${os.EOL}`
						);
					});
			}
		);
	});

	leche.withData(['trash', 'trash:list'], function (command) {
		describe(command, function () {
			let fixture = getFixture('trash/get_trashed_items_page_1'),
				fixture2 = getFixture('trash/get_trashed_items_page_2'),
				jsonOutput = getFixture('output/trash_list_json.txt');

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/folders/trash/items')
					.query({ usemarker: true, limit: 1000 })
					.reply(200, fixture)
					.get('/2.0/folders/trash/items')
					.query({
						offset: 2,
						usemarker: true,
						limit: 1000,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([command, '--json', '--token=test'])
				.it(
					'should list all items in trash (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/folders/trash/items')
					.query({ fields: 'name', usemarker: true, limit: 1000 })
					.reply(200, fixture)
					.get('/2.0/folders/trash/items')
					.query({
						fields: 'name',
						offset: 2,
						usemarker: true,
						limit: 1000,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([command, '--fields=name', '--json', '--token=test'])
				.it(
					'should send fields param to the API when --fiels flag is passed'
				);
		});
	});

	describe('trash:get', function () {
		let folderFixture = getFixture('trash/get_folders_id_trash'),
			fileFixture = getFixture('trash/get_files_id_trash'),
			webLinkFixture = getFixture('trash/get_folders_id_trash');
		let itemId = '12345';

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/folders/${itemId}/trash`).reply(200, folderFixture)
		)
			.stdout()
			.command(['trash:get', 'folder', itemId, '--json', '--token=test'])
			.it(
				'should get information on a folder in trash (JSON Output)',
				(context) => {
					let fixtureJSON = JSON.parse(folderFixture);
					let outputJSON = JSON.parse(context.stdout);
					assert.deepEqual(outputJSON, fixtureJSON);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${itemId}/trash`).reply(200, fileFixture)
		)
			.stdout()
			.command(['trash:get', 'file', itemId, '--json', '--token=test'])
			.it(
				'should get information on a file in trash (JSON Output)',
				(context) => {
					let fixtureJSON = JSON.parse(fileFixture);
					let outputJSON = JSON.parse(context.stdout);
					assert.deepEqual(outputJSON, fixtureJSON);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/web_links/${itemId}/trash`).reply(200, webLinkFixture)
		)
			.stdout()
			.command([
				'trash:get',
				'web_link',
				itemId,
				'--json',
				'--token=test',
			])
			.it(
				'should get information on a web link in trash (JSON Output)',
				(context) => {
					let fixtureJSON = JSON.parse(webLinkFixture);
					let outputJSON = JSON.parse(context.stdout);
					assert.deepEqual(outputJSON, fixtureJSON);
				}
			);
	});

	describe('trash:restore', function () {
		let folderFixture = getFixture('trash/post_folders_id'),
			fileFixture = getFixture('trash/post_files_id'),
			webLinkFixture = getFixture('trash/post_web_links_id');

		let itemId = '1234',
			name = 'Contracts',
			parentId = '0';

		let expectedBody = {
			name,
			parent: { id: parentId },
		};
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/folders/${itemId}`, expectedBody)
				.reply(201, folderFixture)
		)
			.stdout()
			.command([
				'trash:restore',
				'folder',
				itemId,
				`--name=${name}`,
				`--parent-id=${parentId}`,
				'--json',
				'--token=test',
			])
			.it(
				'should restore a folder from trash (JSON Output)',
				(context) => {
					let fixtureJSON = JSON.parse(folderFixture);
					let outputJSON = JSON.parse(context.stdout);
					assert.deepEqual(outputJSON, fixtureJSON);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/files/${itemId}`, expectedBody)
				.reply(201, fileFixture)
		)
			.stdout()
			.command([
				'trash:restore',
				'file',
				itemId,
				`--name=${name}`,
				`--parent-id=${parentId}`,
				'--json',
				'--token=test',
			])
			.it('should restore a file from trash (JSON Output)', (context) => {
				let fixtureJSON = JSON.parse(fileFixture);
				let outputJSON = JSON.parse(context.stdout);
				assert.deepEqual(outputJSON, fixtureJSON);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/web_links/${itemId}`, expectedBody)
				.reply(201, webLinkFixture)
		)
			.stdout()
			.command([
				'trash:restore',
				'web_link',
				itemId,
				`--name=${name}`,
				`--parent-id=${parentId}`,
				'--json',
				'--token=test',
			])
			.it(
				'should restore a web link from trash (JSON Output)',
				(context) => {
					let fixtureJSON = JSON.parse(webLinkFixture);
					let outputJSON = JSON.parse(context.stdout);
					assert.deepEqual(outputJSON, fixtureJSON);
				}
			);
	});
});
