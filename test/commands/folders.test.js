'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const fs = require('fs-extra');
const path = require('path');
const { getFixture, TEST_API_ROOT, TEST_UPLOAD_ROOT, TEST_DOWNLOAD_ROOT } = require('../helpers/test-helper');
const os = require('os');
const leche = require('leche');
const _ = require('lodash');

describe('Folders', () => {

	describe('folders:get', () => {
		let folderId = '0',
			getFolderFixture = getFixture('folders/get_folders_id'),
			yamlOutput = getFixture('output/folders_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderId}`)
				.reply(200, getFolderFixture)
			)
			.stdout()
			.command([
				'folders:get',
				folderId,
				'--json',
				'--token=test'
			])
			.it('should get information about a folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getFolderFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderId}`)
				.reply(200, getFolderFixture)
			)
			.stdout()
			.command([
				'folders:get',
				folderId,
				'--token=test'
			])
			.it('should get information about a folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('folders:copy', () => {
		let folderId = '0',
			parentFolderId = '987654321',
			name = 'Rename on copy.txt',
			copyFixture = getFixture('folders/post_folders_id_copy'),
			yamlOutput = getFixture('output/folders_copy_yaml.txt');

		let copyBody = {
			parent: {
				id: parentFolderId
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/copy`, copyBody)
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'folders:copy',
				folderId,
				parentFolderId,
				'--json',
				'--token=test'
			])
			.it('should copy a folder to a different folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, copyFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/copy`, copyBody)
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'folders:copy',
				folderId,
				parentFolderId,
				'--token=test'
			])
			.it('should copy a folder to a different folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/copy`, copyBody)
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'folders:copy',
				folderId,
				parentFolderId,
				'--id-only',
				'--token=test'
			])
			.it('should copy a folder to a different folder (ID Output)', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(copyFixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/copy`, {
					...copyBody,
					name,
				})
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'folders:copy',
				folderId,
				parentFolderId,
				`--name=${name}`,
				'--json',
				'--token=test'
			])
			.it('should set optional name param when --name flag is passed', ctx => {
				assert.equal(ctx.stdout, copyFixture);
			});
	});

	describe('folders:move', () => {
		let folderId = '0',
			parentFolderId = '987654321',
			moveFixture = getFixture('folders/put_folders_id'),
			yamlOutput = getFixture('output/folders_move_yaml.txt');

		let moveBody = {
			parent: {
				id: parentFolderId
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, moveBody)
				.reply(200, moveFixture)
			)
			.stdout()
			.command([
				'folders:move',
				folderId,
				parentFolderId,
				'--json',
				'--token=test'
			])
			.it('should move a folder to a different folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, moveFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, moveBody)
				.reply(200, moveFixture)
			)
			.stdout()
			.command([
				'folders:move',
				folderId,
				parentFolderId,
				'--token=test'
			])
			.it('should move a folder to a different folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, moveBody)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message: 'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide'
				})
			)
			.stdout()
			.stderr()
			.command([
				'folders:move',
				folderId,
				parentFolderId,
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});
	});

	describe('folders:delete', () => {
		let folderId = '0';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/folders/${folderId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'folders:delete',
				folderId,
				'--token=test'
			])
			.it('should delete a folder', ctx => {
				assert.equal(ctx.stderr, `Deleted folder ${folderId}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/folders/${folderId}`)
				.query({ recursive: true })
				.reply(204)
			)
			.stderr()
			.command([
				'folders:delete',
				folderId,
				'--recursive',
				'--token=test'
			])
			.it('should send recursive param when --recursive flag is passed', ctx => {
				assert.equal(ctx.stderr, `Deleted folder ${folderId}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/folders/${folderId}`)
				.reply(204)
				.delete(`/2.0/folders/${folderId}/trash`)
				.reply(204)
			)
			.stderr()
			.command([
				'folders:delete',
				folderId,
				'-f',
				'--token=test'
			])
			.it('should delete a folder permanently when -f flag is passed', ctx => {
				assert.equal(ctx.stderr, `Deleted folder ${folderId} permanently${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/folders/${folderId}`)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message: 'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide'
				})
			)
			.stdout()
			.stderr()
			.command([
				'folders:delete',
				folderId,
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/folders/${folderId}`)
				.reply(204)
				.delete(`/2.0/folders/${folderId}/trash`)
				.reply(404)
			)
			.stderr()
			.command([
				'folders:delete',
				folderId,
				'-f',
				'--token=test'
			])
			.it('should force delete successfully when user does not have trash enabled', ctx => {
				assert.equal(ctx.stderr, `Deleted folder ${folderId} permanently${os.EOL}`);
			});
	});

	leche.withData([
		'folders:collaborations',
		'folders:collaborations:list'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				getCollaborationFixture = getFixture('folders/get_folders_id_collaborations'),
				jsonOutput = getFixture('output/folders_collaborations_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/folders/${folderId}/collaborations`)
					.reply(200, getCollaborationFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					'--json',
					'--token=test'
				])
				.it('should list all collaborations on a Box item (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	describe('folders:collaborations:add', () => {
		let folderId = '0',
			addCollaborationFixture = getFixture('folders/post_collaborations_user'),
			yamlOutput = getFixture('output/folders_collaborations_add_yaml.txt');

		let addCollaborationBody = {
			item: {
				type: 'folder',
				id: folderId
			},
			accessible_by: {
				type: 'user',
				login: 'newfriend@example.com'
			},
			role: 'previewer'
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'folders:collaborations:add',
				folderId,
				'--previewer',
				'--login=newfriend@example.com',
				'--json',
				'--token=test'
			])
			.it('should create a collaboration for a Box item with the previewer and login flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, addCollaborationFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'folders:collaborations:add',
				folderId,
				'--previewer',
				'--login=newfriend@example.com',
				'--token=test'
			])
			.it('should create a collaboration for a Box item with the previewer and login flags passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'folders:collaborations:add',
				folderId,
				'--previewer',
				'--login=newfriend@example.com',
				'--id-only',
				'--token=test'
			])
			.it('should output only the ID of the created collaboration when the --id-only flag is passed', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(addCollaborationFixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'folders:collaborations:add',
				'--previewer',
				'--login=newfriend@example.com',
				folderId,
				'--json',
				'--token=test'
			])
			.it('should work with args in non-standard order', ctx => {
				assert.equal(ctx.stdout, addCollaborationFixture);
			});
	});

	describe('folders:rename', () => {
		let folderId = '0',
			description = 'test description',
			renameFixture = getFixture('folders/put_folders_id'),
			yamlOutput = getFixture('output/folders_rename_yaml.txt');

		let renameBody = {
			name: 'test',
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, renameBody)
				.reply(200, renameFixture)
			)
			.stdout()
			.command([
				'folders:rename',
				folderId,
				'test',
				'--json',
				'--token=test'
			])
			.it('should rename a folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, renameFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, renameBody)
				.reply(200, renameFixture)
			)
			.stdout()
			.command([
				'folders:rename',
				folderId,
				'test',
				'--token=test'
			])
			.it('should rename a folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, {
					...renameBody,
					description,
				})
				.reply(200, renameFixture)
			)
			.stdout()
			.command([
				'folders:rename',
				folderId,
				'test',
				`--description=${description}`,
				'--json',
				'--token=test'
			])
			.it('should send the description param when the --description flag is passed', ctx => {
				assert.equal(ctx.stdout, renameFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, {
					...renameBody,
					description,
				})
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message: 'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide'
				})
			)
			.stdout()
			.stderr()
			.command([
				'folders:rename',
				folderId,
				'test',
				`--description=${description}`,
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});
	});

	describe('folders:metadata:get', () => {
		let folderId = '0',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			getMetadataFixture = getFixture('folders/get_folders_id_metadata_scope_template'),
			yamlOutput = getFixture('output/folders_metadata_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:get',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--json',
				'--token=test'
			])
			.it('should get information about a metadata object (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getMetadataFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:get',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--token=test'
			])
			.it('should get information about a metadata object (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	leche.withData([
		'folders:metadata',
		'folders:metadata:get-all'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				getAllMetadataFixture = getFixture('folders/get_folders_id_metadata'),
				jsonOutput = getFixture('output/folders_metadata_get_all_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/folders/${folderId}/metadata`)
					.reply(200, getAllMetadataFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					'--json',
					'--token=test'
				])
				.it('should get all metadata on a Box item (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

		});
	});

	leche.withData([
		'folders:metadata:remove',
		'folders:metadata:delete'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				metadataScope = 'enterprise',
				metadataTemplate = 'testTemplate';

			test
				.nock(TEST_API_ROOT, api => api
					.delete(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`)
					.reply(204)
				)
				.stderr()
				.command([
					command,
					folderId,
					`--template-key=${metadataTemplate}`,
					'--token=test'
				])
				.it('should delete metadata from an item', ctx => {
					assert.equal(ctx.stderr, `Successfully deleted metadata ${metadataTemplate}${os.EOL}`);
				});
		});
	});

	describe('folders:metadata:update', () => {
		let folderId = '0',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			getMetadataFixture = getFixture('folders/get_folders_id_metadata_scope_template'),
			yamlOutput = getFixture('output/folders_metadata_update_yaml.txt');

		let updateMetadataBody = [
			{
				op: 'test',
				path: '/numReviewsLeft',
				value: 1
			},
			{
				op: 'replace',
				path: '/numReviewsLeft',
				value: 0,
			},
			{
				op: 'copy',
				from: '/competitiveDocument',
				path: '/restricted',
			},
			{
				op: 'add',
				path: '/reviewedBy/-',
				value: 'me',
			},
			{
				op: 'replace',
				path: '/readyForRelease',
				value: 'yes',
			},
			{
				op: 'move',
				from: '/reviewedBy',
				path: '/approvedBy',
			},
			{
				op: 'add',
				path: '/dateApproved',
				value: '2018-12-02T11:28:55-08:00',
			},
			{
				op: 'replace',
				path: '/stepsRequiredForRelease',
				value: [],
			},
			{
				op: 'remove',
				path: '/embargoed',
			}
		];

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, updateMetadataBody)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:update',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--test=/numReviewsLeft=#1',
				'--replace=/numReviewsLeft=#0',
				'--copy=/competitiveDocument>/restricted',
				'--add=reviewedBy[]=me',
				'--replace=/readyForRelease=yes',
				'--move=reviewedBy>approvedBy',
				'--add=/dateApproved=2018-12-02T11:28:55-08:00',
				'--replace=/stepsRequiredForRelease=[]',
				'--remove=/embargoed',
				'--json',
				'--token=test'
			])
			.it('should update metadata object with all op flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getMetadataFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, updateMetadataBody)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:update',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--test=/numReviewsLeft=#1',
				'--replace=/numReviewsLeft=#0',
				'--copy=/competitiveDocument>/restricted',
				'--add=reviewedBy[]=me',
				'--replace=/readyForRelease=yes',
				'--move=reviewedBy>approvedBy',
				'--add=/dateApproved=2018-12-02T11:28:55-08:00',
				'--replace=/stepsRequiredForRelease=[]',
				'--remove=/embargoed',
				'--token=test'
			])
			.it('should update metadata object with all flags passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	leche.withData([
		'folders:metadata:add',
		'folders:metadata:create'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				metadataScope = 'enterprise',
				metadataTemplate = 'testTemplate',
				addMetadataFixture = getFixture('folders/post_folders_id_metadata_scope_template'),
				yamlOutput = getFixture('output/folders_metadata_create_yaml.txt');

			let createMetadataBody = {
				test: 'test123',
				number: 1.9,
				arr: [
					'foo',
					'bar'
				]
			};

			test
				.nock(TEST_API_ROOT, api => api
					.post(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
					.reply(201, addMetadataFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					`--template-key=${metadataTemplate}`,
					'--data=test=test123',
					'--data=number=#1.9',
					'--data=arr=[foo,bar]',
					'--json',
					'--token=test'
				])
				.it('should add metadata object with key/value pairs passed as a flag (JSON Output)', ctx => {
					assert.equal(ctx.stdout, addMetadataFixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
					.reply(201, addMetadataFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					`--template-key=${metadataTemplate}`,
					'--data=test=test123',
					'--data=number=#1.9',
					'--data=arr=[foo,bar]',
					'--token=test'
				])
				.it('should add metadata object with key/value pairs passed as a flag (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});
		});
	});

	describe('folders:metadata:set', () => {
		let folderId = '0',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			addMetadataFixture = getFixture('folders/post_folders_id_metadata_scope_template'),
			yamlOutput = getFixture('output/folders_metadata_create_yaml.txt');

		let createMetadataBody = {
			test: 'test123',
			number: 1.9,
			arr: [
				'foo',
				'bar'
			]
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
				.reply(201, addMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:set',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--data=test=test123',
				'--data=number=#1.9',
				'--data=arr=[foo,bar]',
				'--json',
				'--token=test'
			])
			.it('should add metadata object with key/value pairs passed as a flag (JSON Output)', ctx => {
				assert.equal(ctx.stdout, addMetadataFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
				.reply(201, addMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:set',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--data=test=test123',
				'--data=number=#1.9',
				'--data=arr=[foo,bar]',
				'--token=test'
			])
			.it('should add metadata object with key/value pairs passed as a flag (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
				.reply(409)
				.put(`/2.0/folders/${folderId}/metadata/${metadataScope}/${metadataTemplate}`, [
					{
						op: 'add',
						path: '/test',
						value: 'test123',
					},
					{
						op: 'add',
						path: '/number',
						value: 1.9,
					},
					{
						op: 'add',
						path: '/arr',
						value: [
							'foo',
							'bar'
						],
					}
				])
				.reply(200, addMetadataFixture)
			)
			.stdout()
			.command([
				'folders:metadata:set',
				folderId,
				`--template-key=${metadataTemplate}`,
				'--data=test=test123',
				'--data=number=#1.9',
				'--data=arr=[foo,bar]',
				'--json',
				'--token=test'
			])
			.it('should update metadata object with key/value pairs passed as a flag when creation conflicts', ctx => {
				assert.equal(ctx.stdout, addMetadataFixture);
			});


	});

	leche.withData([
		'folders:share',
		'folders:shared-links:create',
		'folders:shared-links:update'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				createSharedLinkFixture = getFixture('folders/put_folders_id_shared_link'),
				unshareDate = '2030-03-04T12:34:56+00:00',
				jsonOutput = getFixture('output/folders_share_json.txt'),
				yamlOutput = getFixture('output/folders_share_yaml.txt');

			let sharedLinkBody = {
				shared_link: {
					permissions: { can_download: true },
					access: 'test',
					password: 'test'
				}
			};

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/folders/${folderId}`, sharedLinkBody)
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					'--access=test',
					'--password=test',
					'--can-download',
					'--json',
					'--token=test'
				])
				.it('should create a shared link for a Box item with access, password and can-download flags passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/folders/${folderId}`, sharedLinkBody)
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					'--access=test',
					'--password=test',
					'--can-download',
					'--token=test'
				])
				.it('should create a shared link for a Box item with access, password and can-download flags passed (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/folders/${folderId}`, {
						shared_link: {
							permissions: {},
							unshared_at: unshareDate,
						},
					})
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					folderId,
					`--unshared-at=${unshareDate}`,
					'--json',
					'--token=test'
				])
				.it('should send unshared_at param when --unshared-at flag is passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	leche.withData([
		'folders:unshare',
		'folders:shared-links:delete'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				getFolderFixture = getFixture('folders/get_folders_id');

			let deleteSharedLinkBody = {
				shared_link: null
			};

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/folders/${folderId}`, deleteSharedLinkBody)
					.reply(200, getFolderFixture)
				)
				.stdout()
				.stderr()
				.command([
					command,
					folderId,
					'--json',
					'--no-color',
					'--token=test'
				])
				.it('should delete a shared link for a folder', ctx => {
					assert.equal(ctx.stdout, '');
					assert.equal(ctx.stderr, `Removed shared link from folder "All Files"${os.EOL}`);
				});
		});
	});

	leche.withData([
		'folders:items',
		'folders:list-items'
	], function(command) {

		describe(command, () => {
			let folderId = '0',
				sort = 'date',
				direction = 'DESC',
				fixture = getFixture('folders/get_folders_id_items_page_1'),
				fixture2 = getFixture('folders/get_folders_id_items_page_2'),
				jsonOutput = getFixture('output/folders_list_items_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/folders/${folderId}/items`)
					.query({ usemarker: true })
					.reply(200, fixture)
					.get(`/2.0/folders/${folderId}/items`)
					.query({
						usemarker: true,
						marker: 'page_1_marker',
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					folderId,
					'--json',
					'--token=test'
				])
				.it('should list items in a folder (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/folders/${folderId}/items`)
					.query({
						sort,
						direction,
						usemarker: true,
					})
					.reply(200, fixture)
					.get(`/2.0/folders/${folderId}/items`)
					.query({
						sort,
						direction,
						usemarker: true,
						marker: 'page_1_marker',
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					folderId,
					`--sort=${sort}`,
					`--direction=${direction}`,
					'--json',
					'--token=test'
				])
				.it('should send sorting params when --sort and --direction flags are passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/folders/${folderId}/items`)
					.query({
						fields: 'created_at',
						usemarker: true,
					})
					.reply(200, fixture)
					.get(`/2.0/folders/${folderId}/items`)
					.query({
						fields: 'created_at',
						usemarker: true,
						marker: 'page_1_marker',
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					folderId,
					'--fields=created_at',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	describe('folders:create', () => {
		let parentFolderId = '0',
			name = 'New Folder',
			description = 'This is my new folder',
			fixture = getFixture('folders/post_folders'),
			yamlOutput = getFixture('output/folders_create_yaml.txt');

		let expectedBody = {
			parent: {
				id: parentFolderId
			},
			name
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/folders', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'folders:create',
				parentFolderId,
				name,
				'--json',
				'--token=test'
			])
			.it('should create a new folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/folders', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'folders:create',
				parentFolderId,
				name,
				'--token=test'
			])
			.it('should create a new folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/folders', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'folders:create',
				parentFolderId,
				name,
				'--id-only',
				'--token=test'
			])
			.it('should create a new folder with the id-only flagged passed (ID Output)', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(fixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/folders', {
					...expectedBody,
					description,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'folders:create',
				parentFolderId,
				name,
				`--description=${description}`,
				'--json',
				'--token=test'
			])
			.it('should send the description param when --description is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('folders:update', () => {
		let folderId = '0',
			name = 'New Folder',
			description = 'New description',
			tags = 'foo,bar',
			fixture = getFixture('folders/put_folders_id'),
			yamlOutput = getFixture('output/folders_update_yaml.txt');

		let expectedBody = {
			name,
			sync_state: 'synced',
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'folders:update',
				folderId,
				`--name=${name}`,
				'--sync',
				'--json',
				'--token=test'
			])
			.it('should update a folder with name and synced flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'folders:update',
				folderId,
				`--name=${name}`,
				'--sync',
				'--token=test'
			])
			.it('should update a folder with name and synced flags passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, {
					...expectedBody,
					description,
					tags: tags.split(','),
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'folders:update',
				folderId,
				`--name=${name}`,
				`--description=${description}`,
				`--tags=${tags}`,
				'--sync',
				'--json',
				'--token=test'
			])
			.it('should send optional params when flags are passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/folders/${folderId}`, expectedBody)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message: 'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide'
				})
			)
			.stdout()
			.stderr()
			.command([
				'folders:update',
				folderId,
				`--name=${name}`,
				'--sync',
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});

		// @TODO(2018-08-21): Add tests for other flags
	});

	describe('folders:upload', () => {
		let parentFolderId = '1234',
			name1 = 'test_folder',
			name2 = 'nested_folder',
			folderId = '22222',
			folderPath = path.join(__dirname, '..', 'fixtures/folders/test_folder'),
			testFileName = 'test_file.txt',
			createFolderFixture = getFixture('folders/post_folders'),
			uploadFileFixture = getFixture('folders/post_files_content'),
			getFolderFixture = getFixture('folders/get_folders_id'),
			yamlOutput = getFixture('output/folders_upload_yaml.txt');

		let expectedBody1 = {
			parent: {
				id: parentFolderId
			},
			name: name1
		};
		let expectedBody2 = {
			parent: {
				id: folderId
			},
			name: name2
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/folders', expectedBody1)
				.reply(201, createFolderFixture)
				.post('/2.0/folders', expectedBody2)
				.reply(201, createFolderFixture)
			)
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', body => {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
				.post('/2.0/files/content', body => {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderId}`)
				.reply(200, getFolderFixture)
			)
			.stdout()
			.command([
				'folders:upload',
				folderPath,
				`--parent-folder=${parentFolderId}`,
				'--json',
				'--token=test'
			])
			.it('should upload a folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getFolderFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/folders', expectedBody1)
				.reply(201, createFolderFixture)
				.post('/2.0/folders', expectedBody2)
				.reply(201, createFolderFixture)
			)
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', body => {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
				.post('/2.0/files/content', body => {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderId}`)
				.reply(200, getFolderFixture)
			)
			.stdout()
			.command([
				'folders:upload',
				folderPath,
				`--parent-folder=${parentFolderId}`,
				'--token=test'
			])
			.it('should upload a folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

	});

	describe('folders:download', () => {

		let downloadPath = path.join(__dirname, '../fixtures/folders/test_folder_download'),
			folderID = '11111',
			folderName = 'DownloadFolderTest',
			getFolderFixture = getFixture('folders/get_folders_id_folder_download'),
			getSubfolderFixture = getFixture('folders/get_folders_id_subfolder_download'),
			getLargeFolderFixture = getFixture('folders/get_folders_id_large_folder'),
			largeFolderPage1Fixture = getFixture('folders/get_folders_id_items_page_1_folder_download'),
			largeFolderPage2Fixture = getFixture('folders/get_folders_id_items_page_2_folder_download');

		let expectedContents = {
			'file 1.txt': 'File 1 contents',
			'file 2.txt': 'File 2 contents',
			subfolder: {
				'subfolder file 1.txt': 'File 3 contents'
			}
		};

		async function getDirectoryContents(folderPath) {

			let obj = {};
			let folderContents = await fs.readdir(folderPath);
			folderContents.forEach(async item => {
				let itemPath = path.join(folderPath, item);
				let stat = await fs.stat(itemPath);
				if (stat.isDirectory()) {
					obj[item] = await getDirectoryContents(itemPath);
				} else {
					obj[item] = await fs.readFile(itemPath, 'utf8');
				}
			});

			return obj;
		}

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderID}`)
				.reply(200, getFolderFixture)
				.get('/2.0/folders/22222')
				.reply(200, getSubfolderFixture)
				.get('/2.0/files/77777/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/77777` })
				.get('/2.0/files/44444/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/44444` })
				.get('/2.0/files/55555/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/55555` })
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get('/44444')
				.reply(200, expectedContents['file 1.txt'])
				.get('/55555')
				.reply(200, expectedContents['file 2.txt'])
				.get('/77777')
				.reply(200, expectedContents.subfolder['subfolder file 1.txt'])
			)
			.stdout()
			.stderr()
			.do(async() => {
				await fs.mkdirp(downloadPath);
			})
			.command([
				'folders:download',
				folderID,
				`--destination=${downloadPath}`,
				'--token=test'
			])
			.it('should download folder to specified path on disk when called with destination flag', async ctx => {
				let folderPath = path.join(downloadPath, folderName);
				let actualContents = await getDirectoryContents(folderPath);
				await fs.remove(downloadPath);

				assert.deepEqual(actualContents, expectedContents);
				assert.equal(ctx.stdout, '');
			});

		test
			.nock(TEST_API_ROOT, api => {

				api
					.get(`/2.0/folders/${folderID}`)
					.reply(200, getLargeFolderFixture)
					.get(`/2.0/folders/${folderID}/items`)
					.query({
						usemarker: true,
						fields: 'type,id,name',
					})
					.reply(200, largeFolderPage1Fixture)
					.get(`/2.0/folders/${folderID}/items`)
					.query({
						usemarker: true,
						fields: 'type,id,name',
						marker: 'page_1_marker',
					})
					.reply(200, largeFolderPage2Fixture);


				for (let i = 1; i <= 200; i++) {
					api.get(`/2.0/files/${i}/content`)
						.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/${i}` });
				}
			})
			.nock(TEST_DOWNLOAD_ROOT, api => {

				for (let i = 1; i <= 200; i++) {
					api.get(`/${i}`)
						.reply(200, `File ${i} contents`);
				}
			})
			.stdout()
			.stderr()
			.do(async() => {
				await fs.mkdirp(downloadPath);
			})
			.command([
				'folders:download',
				folderID,
				`--destination=${downloadPath}`,
				'--token=test'
			])
			.it('should correctly download contents when Box folder has many items', async ctx => {
				let manyFilesExpectedContents = {};
				for (let i = 1; i <= 200; i++) {
					manyFilesExpectedContents[`file ${i}.txt`] = `File ${i} contents`;
				}
				let folderPath = path.join(downloadPath, folderName);
				let actualContents = await getDirectoryContents(folderPath);
				await fs.remove(downloadPath);

				assert.deepEqual(actualContents, manyFilesExpectedContents);
				assert.equal(ctx.stdout, '');
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderID}`)
				.reply(200, getFolderFixture)
				.get('/2.0/files/44444/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/44444` })
				.get('/2.0/files/55555/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/55555` })
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get('/44444')
				.reply(200, expectedContents['file 1.txt'])
				.get('/55555')
				.reply(200, expectedContents['file 2.txt'])
			)
			.stdout()
			.stderr()
			.do(async() => {
				await fs.mkdirp(downloadPath);
			})
			.command([
				'folders:download',
				folderID,
				`--destination=${downloadPath}`,
				'--depth=0',
				'--token=test'
			])
			.it('should only download files in top-level folder when --depth=0 flag is passed', async ctx => {
				let folderPath = path.join(downloadPath, folderName);
				let actualContents = await getDirectoryContents(folderPath);
				await fs.remove(downloadPath);

				assert.deepEqual(actualContents, _.omit(expectedContents, 'subfolder'));
				assert.equal(ctx.stdout, '');
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/folders/${folderID}`)
				.reply(200, getFolderFixture)
				.get('/2.0/folders/22222')
				.reply(200, getSubfolderFixture)
				.get('/2.0/files/77777/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/77777` })
				.get('/2.0/files/44444/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/44444` })
				.get('/2.0/files/55555/content')
				.reply(302, '', { Location: `${TEST_DOWNLOAD_ROOT}/55555` })
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get('/44444')
				.reply(200, expectedContents['file 1.txt'])
				.get('/55555')
				.reply(200, expectedContents['file 2.txt'])
				.get('/77777')
				.reply(200, expectedContents.subfolder['subfolder file 1.txt'])
			)
			.stdout()
			.stderr()
			.do(async() => {
				await fs.mkdirp(downloadPath);
			})
			.command([
				'folders:download',
				folderID,
				`--destination=${downloadPath}`,
				'--zip',
				'--token=test'
			])
			.it('should download folder to zip file when --zip flag is passed', async ctx => {
				// Find zip file in directory
				let filename = (await fs.readdir(downloadPath))
					.find(f => f.startsWith(`folders-download-${folderID}`) && f.endsWith('.zip'));
				await fs.remove(downloadPath);

				// @TODO(2018-10-30): Verify contents of zip file

				assert.ok(filename, 'File shoudl have been found');
				assert.equal(ctx.stdout, '');
			});

		test
			.stdout()
			.stderr()
			.command([
				'folders:download',
				folderID,
				'--destination=/path/really/should/not/exist',
				'--no-color',
				'--token=test'
			])
			.it('should output error when destination directory does not exist', ctx => {
				assert.equal(ctx.stderr, `Destination path must be a directory${os.EOL}`);
			});
	});

});
