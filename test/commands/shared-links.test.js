'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');

describe('Shared-Links', function () {
	describe('shared-links:get', function () {
		let url = 'https://app.box.com/s/qwertyuiopasdfghjklzxcvbnm123456',
			fixture = getFixture('shared-links/get_shared_items'),
			yamlOutput = getFixture('output/shared_links_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/shared_items').reply(200, fixture)
		)
			.stdout()
			.command(['shared-links:get', url, '--json', '--token=test'])
			.it(
				'should get information from a shared item URL (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/shared_items').reply(200, fixture)
		)
			.stdout()
			.command(['shared-links:get', url, '--token=test'])
			.it(
				'should get information from a shared item URL (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shared_items')
				.query({ fields: 'name' })
				.reply(200, fixture)
		)
			.stdout()
			.command(['shared-links:get', url, '--fields=name', '--token=test'])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('shared-links:create', function () {
		let fileId = '1234567890',
			vanityName = 'my-custom-name-123',
			createFileSharedLinkFixture = getFixture(
				'files/put_files_id_shared_link'
			),
			fileJsonOutput = getFixture('output/files_share_json.txt'),
			fileYamlOutput = getFixture('output/files_share_yaml.txt');

		let fileSharedLinkBody = {
			shared_link: {
				permissions: { can_download: true, can_edit: true },
				vanity_name: vanityName,
			},
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/files/${fileId}?fields=shared_link`,
					fileSharedLinkBody
				)
				.reply(200, createFileSharedLinkFixture)
		)
			.stdout()
			.command([
				'shared-links:create',
				fileId,
				'file',
				'--can-download',
				'--can-edit',
				`--vanity-name=${vanityName}`,
				'--token=test',
			])
			.it(
				'should create a shared link for a Box file (YAML Output)',
				(context) => {
					assert.equal(context.stdout, fileYamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/files/${fileId}?fields=shared_link`,
					fileSharedLinkBody
				)
				.reply(200, createFileSharedLinkFixture)
		)
			.stdout()
			.command([
				'shared-links:create',
				fileId,
				'file',
				'--can-download',
				'--can-edit',
				`--vanity-name=${vanityName}`,
				'--token=test',
				'--json',
			])
			.it(
				'should create a shared link for a Box file (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fileJsonOutput);
				}
			);

		let folderId = '1234567890',
			createFolderSharedLinkFixture = getFixture(
				'files/put_files_id_shared_link'
			),
			folderSharedLinkBody = {
				shared_link: {
					permissions: { can_download: true },
				},
			};

		let folderJsonOutput = getFixture('output/files_share_json.txt'),
			folderYamlOutput = getFixture('output/files_share_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/folders/${folderId}?fields=shared_link`,
					folderSharedLinkBody
				)
				.reply(200, createFolderSharedLinkFixture)
		)
			.stdout()
			.command([
				'shared-links:create',
				folderId,
				'folder',
				'--can-download',
				'--token=test',
			])
			.it(
				'should create a shared link for a Box folder (Yaml Output)',
				(context) => {
					assert.equal(context.stdout, folderYamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/folders/${folderId}?fields=shared_link`,
					folderSharedLinkBody
				)
				.reply(200, createFolderSharedLinkFixture)
		)
			.stdout()
			.command([
				'shared-links:create',
				folderId,
				'folder',
				'--can-download',
				'--token=test',
				'--json',
			])
			.it(
				'should create a shared link for a Box folder (JSON Output)',
				(context) => {
					assert.equal(context.stdout, folderJsonOutput);
				}
			);
	});
});
