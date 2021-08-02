'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');
const { getFixture, TEST_API_ROOT, TEST_UPLOAD_ROOT, TEST_DOWNLOAD_ROOT } = require('../helpers/test-helper');
const os = require('os');
const leche = require('leche');

describe('Files', () => {

	describe('files:get', () => {
		let fileId = '1234567890',
			getFileFixture = getFixture('files/get_files_id'),
			yamlOutput = getFixture('output/files_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
			)
			.stdout()
			.command([
				'files:get',
				fileId,
				'--json',
				'--token=test'
			])
			.it('should get a file\'s information (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getFileFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
			)
			.stdout()
			.command([
				'files:get',
				fileId,
				'--token=test'
			])
			.it('should get a file\'s information (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.query({fields: 'comment_count'})
				.reply(200, getFileFixture)
			)
			.stdout()
			.command([
				'files:get',
				fileId,
				'--fields=comment_count',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('files:copy', () => {
		let fileId = '1234567890',
			parentFolderId = '987654321',
			newName = 'Copied file.dat',
			version = '55555',
			copyFixture = getFixture('files/post_files_id_copy'),
			yamlOutput = getFixture('output/files_copy_yaml.txt');

		let copyBody = {
			parent: {
				id: parentFolderId
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/files/${fileId}/copy`, copyBody)
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'files:copy',
				fileId,
				parentFolderId,
				'--json',
				'--token=test'
			])
			.it('should copy a file to a different folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, copyFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/files/${fileId}/copy`, copyBody)
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'files:copy',
				fileId,
				parentFolderId,
				'--token=test'
			])
			.it('should copy a file to a different folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/files/${fileId}/copy`, copyBody)
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'files:copy',
				fileId,
				parentFolderId,
				'--id-only',
				'--token=test'
			])
			.it('should output only the ID of the copied file when --id-only flag is passed', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(copyFixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/files/${fileId}/copy`, {
					...copyBody,
					name: newName,
					version,
				})
				.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'files:copy',
				fileId,
				parentFolderId,
				`--name=${newName}`,
				`--version=${version}`,
				'--json',
				'--token=test'
			])
			.it('should send optional parameters when --name and --version flags are passed', ctx => {
				assert.equal(ctx.stdout, copyFixture);
			});
	});

	describe('files:move', () => {
		let fileId = '1234567890',
			parentFolderId = '987654321',
			moveFixture = getFixture('files/put_files_id'),
			yamlOutput = getFixture('output/files_move_yaml.txt');

		let moveBody = {
			parent: {
				id: parentFolderId
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, moveBody)
				.reply(200, moveFixture)
			)
			.stdout()
			.command([
				'files:move',
				fileId,
				parentFolderId,
				'--json',
				'--token=test'
			])
			.it('should move a file to a different folder (JSON Output)', ctx => {
				assert.equal(ctx.stdout, moveFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, moveBody)
				.reply(200, moveFixture)
			)
			.stdout()
			.command([
				'files:move',
				fileId,
				parentFolderId,
				'--token=test'
			])
			.it('should move a file to a different folder (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, moveBody)
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
				'files:move',
				fileId,
				parentFolderId,
				'--json',
				'--no-color',
				'--etag=5',
				'--token=test'
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});
	});

	describe('files:delete', () => {
		let fileId = '1234567890';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/files/${fileId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'files:delete',
				fileId,
				'--token=test',
			])
			.it('should delete a file', ctx => {
				assert.equal(ctx.stderr, `Deleted file ${fileId}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/files/${fileId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'files:delete',
				fileId,
				'--quiet',
				'--token=test',
			])
			.it('should delete a file, but output no information to stderr', ctx => {
				assert.equal(ctx.stderr, '');
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/files/${fileId}`)
				.reply(204)
				.delete(`/2.0/files/${fileId}/trash`)
				.reply(204)
			)
			.stderr()
			.command([
				'files:delete',
				fileId,
				'-f',
				'--token=test',
			])
			.it('should permanently delete a file when -f flag is passed', ctx => {
				assert.equal(ctx.stderr, `Deleted file ${fileId} permanently${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/files/${fileId}`)
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
				'files:delete',
				fileId,
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
				.delete(`/2.0/files/${fileId}`)
				.reply(204)
				.delete(`/2.0/files/${fileId}/trash`)
				.reply(404)
			)
			.stderr()
			.command([
				'files:delete',
				fileId,
				'-f',
				'--token=test',
			])
			.it('should force delete successfully when user does not have trash enabled', ctx => {
				assert.equal(ctx.stderr, `Deleted file ${fileId} permanently${os.EOL}`);
			});
	});

	describe('files:unlock', () => {
		let fileId = '1234567890',
			lockFixture = getFixture('files/put_files_id_lock'),
			yamlOutput = getFixture('output/files_unlock_yaml.txt');

		let unlockBody = {
			lock: null
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, unlockBody)
				.reply(200, lockFixture)
			)
			.stdout()
			.command([
				'files:unlock',
				fileId,
				'--json',
				'--token=test'
			])
			.it('should unlock a file (JSON Output)', ctx => {
				assert.equal(ctx.stdout, lockFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, unlockBody)
				.reply(200, lockFixture)
			)
			.stdout()
			.command([
				'files:unlock',
				fileId,
				'--token=test'
			])
			.it('should unlock a file (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	leche.withData([
		'files:lock',
		'files:update-lock',
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				expireTime = '2030-01-01T08:00:00+00:00',
				lockFixture = getFixture('files/put_files_id_lock'),
				yamlOutput = getFixture('output/files_lock_yaml.txt');

			let lockBody = {
				lock: {
					type: 'lock',
				}
			};

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, lockBody)
					.reply(200, lockFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--json',
					'--token=test'
				])
				.it('should lock a file (JSON Output)', ctx => {
					assert.equal(ctx.stdout, lockFixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, lockBody)
					.reply(200, lockFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--token=test'
				])
				.it('should lock a file (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, {
						lock: {
							type: 'lock',
							is_download_prevented: true,
						}
					})
					.reply(200, lockFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--prevent-download',
					'--json',
					'--token=test'
				])
				.it('should prevent download when the --prevent-download flag is passed', ctx => {
					assert.equal(ctx.stdout, lockFixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, {
						lock: {
							type: 'lock',
							expires_at: expireTime,
						}
					})
					.reply(200, lockFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					`--expires=${expireTime}`,
					'--json',
					'--token=test'
				])
				.it('should set the expiration time when the --expires flag is passed', ctx => {
					assert.equal(ctx.stdout, lockFixture);
				});
		});
	});

	leche.withData([
		'files:comments',
		'comments:list'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				fixture = getFixture('comments/get_files_id_comments_page_1'),
				fixture2 = getFixture('comments/get_files_id_comments_page_2'),
				jsonOutput = getFixture('output/comments_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/comments`)
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/comments`)
					.query({
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--json',
					'--token=test'
				])
				.it('should list all comments on a file (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/comments`)
					.query({fields: 'message'})
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/comments`)
					.query({
						fields: 'message',
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--fields=message',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'files:collaborations',
		'files:collaborations:list'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				fixture = getFixture('files/get_files_id_collaborations_page_1'),
				fixture2 = getFixture('files/get_files_id_collaborations_page_2'),
				jsonOutput = getFixture('output/files_collaborations_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/collaborations`)
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/collaborations`)
					.query({
						marker: 'ZAED53D'
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--json',
					'--token=test'
				])
				.it('should list all collaborations on a Box item (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/collaborations`)
					.query({fields: 'accessible_by'})
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/collaborations`)
					.query({
						fields: 'accessible_by',
						marker: 'ZAED53D'
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--fields=accessible_by',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	describe('files:collaborations:add', () => {
		let fileId = '1234567890',
			addCollaborationFixture = getFixture('files/post_collaborations_user'),
			yamlOutput = getFixture('output/files_collaborations_add_yaml.txt');

		let addCollaborationBody = {
			item: {
				type: 'file',
				id: fileId
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
				'files:collaborations:add',
				fileId,
				'--previewer',
				'--login=newfriend@example.com',
				'--json',
				'--token=test'
			])
			.it('should create a collaboration for a Box item (JSON Output)', ctx => {
				assert.equal(ctx.stdout, addCollaborationFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'files:collaborations:add',
				fileId,
				'--previewer',
				'--login=newfriend@example.com',
				'--token=test'
			])
			.it('should create a collaboration for a Box item (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'files:collaborations:add',
				fileId,
				'--previewer',
				'--login=newfriend@example.com',
				'--id-only',
				'--token=test'
			])
			.it('should output only the ID of the created collaboration when --id-only flag is passed', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(addCollaborationFixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
			)
			.stdout()
			.command([
				'files:collaborations:add',
				'--previewer',
				'--login=newfriend@example.com',
				fileId,
				'--json',
				'--token=test'
			])
			.it('should work with args in non-standard order', ctx => {
				assert.equal(ctx.stdout, addCollaborationFixture);
			});
	});

	describe('files:rename', () => {
		let fileId = '1234567890',
			renameFixture = getFixture('files/put_files_id'),
			yamlOutput = getFixture('output/files_rename_yaml.txt');

		let renameBody = {
			name: 'test',
			description: 'test description'
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, renameBody)
				.reply(200, renameFixture)
			)
			.stdout()
			.command([
				'files:rename',
				fileId,
				'test',
				'--description=test description',
				'--json',
				'--token=test'
			])
			.it('should rename a file (JSON Output)', ctx => {
				assert.equal(ctx.stdout, renameFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, renameBody)
				.reply(200, renameFixture)
			)
			.stdout()
			.command([
				'files:rename',
				fileId,
				'test',
				'--description=test description',
				'--token=test'
			])
			.it('should rename a file (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}`, renameBody)
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
				'files:rename',
				fileId,
				'test',
				'--description=test description',
				'--json',
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});
	});

	describe('files:metadata:get', () => {
		let fileId = '1234567890',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			getMetadataFixture = getFixture('files/get_files_id_metadata_scope_template'),
			yamlOutput = getFixture('output/files_metadata_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'files:metadata:get',
				fileId,
				`--template-key=${metadataTemplate}`,
				'--json',
				'--token=test'
			])
			.it('should get information about a metadata object (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getMetadataFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'files:metadata:get',
				fileId,
				`--template-key=${metadataTemplate}`,
				'--token=test'
			])
			.it('should get information about a metadata object (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	leche.withData([
		'files:metadata',
		'files:metadata:get-all'
	], function(command) {

		describe(command, () => {
			let fileId = '123456789',
				getAllMetadataFixture = getFixture('files/get_files_id_metadata'),
				jsonOutput = getFixture('output/files_metadata_get_all_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/metadata`)
					.reply(200, getAllMetadataFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--json',
					'--token=test'
				])
				.it('should get all metadata on a Box item', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	leche.withData([
		'files:metadata:remove',
		'files:metadata:delete'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				metadataScope = 'enterprise',
				metadataTemplate = 'testTemplate';

			test
				.nock(TEST_API_ROOT, api => api
					.delete(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`)
					.reply(204)
				)
				.stderr()
				.command([
					command,
					fileId,
					`--template-key=${metadataTemplate}`,
					'--token=test'
				])
				.it('should delete metadata from an item', ctx => {
					assert.equal(ctx.stderr, `Successfully deleted metadata ${metadataTemplate}${os.EOL}`);
				});
		});
	});

	describe('files:metadata:update', () => {
		let fileId = '1234567890',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			getMetadataFixture = getFixture('files/get_files_id_metadata_scope_template'),
			yamlOutput = getFixture('output/files_metadata_update_yaml.txt');

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
				.put(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`, updateMetadataBody)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'files:metadata:update',
				fileId,
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
			.it('should update metadata object (JSON Output)', ctx => {
				assert.equal(ctx.stdout, getMetadataFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`, updateMetadataBody)
				.reply(200, getMetadataFixture)
			)
			.stdout()
			.command([
				'files:metadata:update',
				fileId,
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
			.it('should update metadata object (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	leche.withData([
		'files:metadata:add',
		'files:metadata:create'
	], function(command) {
		describe(command, () => {
			let fileId = '1234567890',
				metadataScope = 'enterprise',
				metadataTemplate = 'testTemplate',
				addMetadataFixture = getFixture('files/post_files_id_metadata_scope_template'),
				yamlOutput = getFixture('output/files_metadata_create_yaml.txt');

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
					.post(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
					.reply(201, addMetadataFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					`--template-key=${metadataTemplate}`,
					'--data=test=test123',
					'--data=number=#1.9',
					'--data=arr=[foo,bar]',
					'--json',
					'--token=test'
				])
				.it('should add metadata object (JSON Output)', ctx => {
					assert.equal(ctx.stdout, addMetadataFixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post(`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
					.reply(201, addMetadataFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					`--template-key=${metadataTemplate}`,
					'--data=test=test123',
					'--data=number=#1.9',
					'--data=arr=[foo,bar]',
					'--token=test'
				])
				.it('should add metadata object (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});
		});
	});

	describe('files:metadata:set', () => {
		let fileID = '11111',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			addMetadataFixture = getFixture('files/post_files_id_metadata_scope_template'),
			yamlOutput = getFixture('output/files_metadata_create_yaml.txt');

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
				.post(`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
				.reply(201, addMetadataFixture)
			)
			.stdout()
			.command([
				'files:metadata:set',
				fileID,
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
				.post(`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
				.reply(201, addMetadataFixture)
			)
			.stdout()
			.command([
				'files:metadata:set',
				fileID,
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
				.post(`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`, createMetadataBody)
				.reply(409)
				.put(`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`, [
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
				'files:metadata:set',
				fileID,
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
		'files:share',
		'files:shared-links:create',
		'files:shared-links:update'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				unsharedDate = '2030-11-18T19:44:17+00:00',
				createSharedLinkFixture = getFixture('files/put_files_id_shared_link'),
				jsonOutput = getFixture('output/files_share_json.txt'),
				yamlOutput = getFixture('output/files_share_yaml.txt');

			let sharedLinkBody = {
				shared_link: {
					permissions: { can_download: true },
					access: 'test',
					password: 'test'
				}
			};

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, sharedLinkBody)
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--access=test',
					'--password=test',
					'--can-download',
					'--json',
					'--token=test'
				])
				.it('should create a shared link for a Box item (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, sharedLinkBody)
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--access=test',
					'--password=test',
					'--can-download',
					'--token=test'
				])
				.it('should create a shared link for a Box item (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, {
						shared_link: {
							permissions: {},
							unshared_at: unsharedDate,
						}
					})
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					fileId,
					`--unshared-at=${unsharedDate}`,
					'--json',
					'--token=test'
				])
				.it('should send unshared_at param when --unshared-at flag is passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, {
						shared_link: {
							permissions: {},
							unshared_at: unsharedDate,
						}
					})
					.reply(200, createSharedLinkFixture)
				)
				.stdout()
				.command([
					command,
					`--unshared-at=${unsharedDate}`,
					'--json',
					fileId,
					'--token=test'
				])
				.it('should work with args in non-standard order', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	leche.withData([
		'files:unshare',
		'files:shared-links:delete'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567809',
				getFileFixture = getFixture('files/get_files_id');

			let deleteSharedLinkBody = {
				shared_link: null
			};

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, deleteSharedLinkBody)
					.reply(200, getFileFixture)
				)
				.stdout()
				.stderr()
				.command([
					command,
					fileId,
					'--json',
					'--no-color',
					'--token=test'
				])
				.it('should delete a shared link for a file', ctx => {
					assert.equal(ctx.stdout, '');
					assert.equal(ctx.stderr, `Removed shared link from file "test_file_download.txt"${os.EOL}`);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/files/${fileId}`, deleteSharedLinkBody)
					.reply(200, getFileFixture)
				)
				.stdout()
				.stderr()
				.command([
					command,
					'--json',
					'--no-color',
					'--token=test',
					fileId
				])
				.it('should work with args in non-standard order', ctx => {
					assert.equal(ctx.stdout, '');
					assert.equal(ctx.stderr, `Removed shared link from file "test_file_download.txt"${os.EOL}`);
				});
		});
	});

	leche.withData([
		'files:tasks',
		'files:tasks:list'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				fixture = getFixture('files/get_files_id_tasks_page_1'),
				fixture2 = getFixture('files/get_files_id_tasks_page_2'),
				jsonOutput = getFixture('output/files_tasks_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/tasks`)
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/tasks`)
					.query({
						offset: 1
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--json',
					'--token=test'
				])
				.it('should list all tasks on this file (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/tasks`)
					.query({fields: 'id'})
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/tasks`)
					.query({
						fields: 'id',
						offset: 1
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--fields=id',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'files:versions',
		'files:versions:list'
	], function(command) {

		describe(command, () => {
			let fileId = '1234567890',
				fixture = getFixture('files/get_files_id_versions_page_1'),
				fixture2 = getFixture('files/get_files_id_versions_page_2'),
				jsonOutput = getFixture('output/files_versions_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/versions`)
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/versions`)
					.query({
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--json',
					'--token=test'
				])
				.it('should get a list of file versions (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/files/${fileId}/versions`)
					.query({fields: 'sha1'})
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/versions`)
					.query({
						fields: 'sha1',
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					fileId,
					'--fields=sha1',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	describe('files:versions:delete', () => {
		let fileId = '1234567890',
			versionId = '1234567890';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/files/${fileId}/versions/${versionId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'files:versions:delete',
				fileId,
				versionId,
				'--token=test'
			])
			.it('should delete a file version', ctx => {
				assert.equal(ctx.stderr, `Deleted file version ${versionId} from file ${fileId}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/files/${fileId}/versions/${versionId}`)
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
				'files:versions:delete',
				fileId,
				versionId,
				'--json',
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});
	});

	describe('files:versions:promote', () => {
		let fileId = '1234567890',
			versionId = '1234567890',
			promoteVersionFixture = getFixture('files/post_files_id_versions_current'),
			yamlOutput = getFixture('output/files_versions_promote_yaml.txt');

		let promoteVersionBody = {
			type: 'file_version',
			id: versionId
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/files/${fileId}/versions/current`, promoteVersionBody)
				.reply(201, promoteVersionFixture)
			)
			.stdout()
			.command([
				'files:versions:promote',
				fileId,
				versionId,
				'--json',
				'--token=test'
			])
			.it('should promote a file version (JSON Output)', ctx => {
				assert.equal(ctx.stdout, promoteVersionFixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post(`/2.0/files/${fileId}/versions/current`, promoteVersionBody)
				.reply(201, promoteVersionFixture)
			)
			.stdout()
			.command([
				'files:versions:promote',
				fileId,
				versionId,
				'--token=test'
			])
			.it('should promote a file version (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('files:update', () => {
		let fileID = '55555',
			name = 'Document v1.pdf',
			description = 'New description',
			tags = 'foo,bar',
			fixture = getFixture('files/put_files_id'),
			yamlOutput = getFixture('output/files_rename_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileID}`, { name })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'files:update',
				fileID,
				`--name=${name}`,
				'--json',
				'--token=test'
			])
			.it('should update a file with name flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileID}`, { name })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'files:update',
				fileID,
				`--name=${name}`,
				'--token=test'
			])
			.it('should update a file with name flag passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileID}`, {
					name,
					description,
					tags: tags.split(','),
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'files:update',
				fileID,
				`--name=${name}`,
				`--description=${description}`,
				`--tags=${tags}`,
				'--json',
				'--token=test'
			])
			.it('should send optional params when flags are passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/files/${fileID}`, { name })
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
				'files:update',
				fileID,
				`--name=${name}`,
				'--no-color',
				'--etag=5',
				'--token=test',
			])
			.it('should send If-Match header and throw error when etag flag is passed but does not match', ctx => {
				let msg = 'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
				assert.equal(ctx.stderr, `${msg}${os.EOL}`);
			});
	});

	describe('files:versions:upload', () => {
		let fileId = '1234567890',
			testFileName = 'test_file.txt',
			testFileContent = 'hello',
			contentModifiedAt = '2012-12-20T20:20:12+00:00',
			testFilePath = path.join(__dirname, '..', `fixtures/files/${testFileName}`),
			uploadFileFixture = getFixture('files/post_files_content'),
			jsonOutput = getFixture('output/files_versions_upload_json.txt'),
			yamlOutput = getFixture('output/files_versions_upload_yaml.txt');

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post(`/2.0/files/${fileId}/content`, function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						assert.match(lines[0], /^-+\d+$/u);
						assert.equal(lines[1], 'Content-Disposition: form-data; name="attributes"');
						assert.equal(lines[2], '');

						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);

						assert.match(lines[4], /^-+\d+$/u);
						assert.equal(lines[5], 'Content-Disposition: form-data; name="content"; filename="unused"');
						assert.equal(lines[6], 'Content-Type: text/plain');
						assert.equal(lines[7], '');
						assert.equal(lines[8], testFileContent);
						assert.match(lines[9], /^-+\d+-+$/u);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:versions:upload',
				fileId,
				testFilePath,
				`--name=${testFileName}`,
				'--json',
				'--token=test'
			])
			.it('should upload a new version of a file (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post(`/2.0/files/${fileId}/content`, function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						assert.match(lines[0], /^-+\d+$/u);
						assert.equal(lines[1], 'Content-Disposition: form-data; name="attributes"');
						assert.equal(lines[2], '');

						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);

						assert.match(lines[4], /^-+\d+$/u);
						assert.equal(lines[5], 'Content-Disposition: form-data; name="content"; filename="unused"');
						assert.equal(lines[6], 'Content-Type: text/plain');
						assert.equal(lines[7], '');
						assert.equal(lines[8], testFileContent);
						assert.match(lines[9], /^-+\d+-+$/u);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:versions:upload',
				fileId,
				testFilePath,
				`--name=${testFileName}`,
				'--token=test'
			])
			.it('should upload a new version of a file (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post(`/2.0/files/${fileId}/content`, function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'content_modified_at', contentModifiedAt);
						assert.equal(lines[8], testFileContent);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:versions:upload',
				fileId,
				testFilePath,
				`--content-modified-at=${contentModifiedAt}`,
				'--json',
				'--token=test'
			])
			.it('should upload file with content timestamp when --content-modified-at flag is passed', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});

	describe('files:upload', () => {
		let parentFolderId = '987654321',
			testFileName = 'test_file.txt',
			newFileName = 'renamed_file.txt',
			testFileContent = 'hello',
			contentCreatedAt = '2017-02-03T12:34:56+00:00',
			contentModifiedAt = '2017-11-18T09:12:44+00:00',
			testFilePath = path.join(__dirname, '..', `fixtures/files/${testFileName}`),
			uploadFileFixture = getFixture('files/post_files_content'),
			jsonOutput = getFixture('output/files_upload_json.txt'),
			yamlOutput = getFixture('output/files_upload_yaml.txt');

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.nestedPropertyVal(attributes, 'parent.id', parentFolderId);
						assert.equal(lines[8], testFileContent);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:upload',
				testFilePath,
				`--parent-id=${parentFolderId}`,
				`--name=${testFileName}`,
				'--json',
				'--token=test'
			])
			.it('should upload a file (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.nestedPropertyVal(attributes, 'parent.id', parentFolderId);
						assert.equal(lines[8], testFileContent);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:upload',
				testFilePath,
				`--parent-id=${parentFolderId}`,
				'--token=test'
			])
			.it('should upload a file (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.nestedPropertyVal(attributes, 'parent.id', parentFolderId);
						assert.equal(lines[8], testFileContent);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:upload',
				testFilePath,
				`--parent-id=${parentFolderId}`,
				'--id-only',
				'--token=test'
			])
			.it('should output only the ID of the new file when --id-only flag is passed', ctx => {
				assert.include(ctx.stdout, JSON.parse(uploadFileFixture).entries[0].id);
			});

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', newFileName);
						assert.nestedPropertyVal(attributes, 'parent.id', parentFolderId);
						assert.equal(lines[8], testFileContent);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:upload',
				testFilePath,
				`--parent-id=${parentFolderId}`,
				`--name=${newFileName}`,
				'--json',
				'--token=test'
			])
			.it('should upload file with new name when --name flag is passed', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_UPLOAD_ROOT, api => api
				.post('/2.0/files/content', function(body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'content_created_at', contentCreatedAt);
						assert.propertyVal(attributes, 'content_modified_at', contentModifiedAt);
						assert.nestedPropertyVal(attributes, 'parent.id', parentFolderId);
						assert.equal(lines[8], testFileContent);
					} catch (error) {
						return false;
					}
					return true;
				})
				.reply(201, uploadFileFixture)
			)
			.stdout()
			.command([
				'files:upload',
				testFilePath,
				`--parent-id=${parentFolderId}`,
				`--content-created-at=${contentCreatedAt}`,
				`--content-modified-at=${contentModifiedAt}`,
				'--json',
				'--token=test'
			])
			.it('should upload file with content timestamps when --content-*-at flags are passed', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});

	describe('files:download', () => {
		let fileId = '12345',
			fileName = 'test_file_download.txt',
			fileVersionID = '8764569',
			testFilePath = path.join(__dirname, '..', 'fixtures/files/epic-poem.txt'),
			fileDownloadPath = path.join(__dirname, '..', 'fixtures/files'),
			getFileFixture = getFixture('files/get_files_id');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadPath
				})
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get(fileDownloadPath)
				.reply(200, function() { return fs.createReadStream(testFilePath, 'utf8'); })
			)
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--destination=${fileDownloadPath}`,
				'-y',
				'--token=test'
			])
			.it('should download a file', ctx => {
				/* eslint-disable no-sync */
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);
				/* eslint-enable no-sync */
				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(ctx.stderr, `Downloaded file test_file_download.txt${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadPath
				})
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get(fileDownloadPath)
				.reply(200, function() { return fs.createReadStream(testFilePath, 'utf8'); })
			)
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--destination=${fileDownloadPath}`,
				`--version=${fileVersionID}`,
				'-y',
				'--token=test'
			])
			.it('should download a file version when version flag is passed', ctx => {
				/* eslint-disable no-sync */
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);
				/* eslint-enable no-sync */
				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(ctx.stderr, `Downloaded file test_file_download.txt${os.EOL}`);
			});
	});

	describe('files:versions:download', () => {

		let fileId = '12345',
			fileName = 'test_file_download.txt',
			fileVersionID = '8764569',
			testFilePath = path.join(__dirname, '..', 'fixtures/files/epic-poem.txt'),
			fileDownloadPath = path.join(__dirname, '..', 'fixtures/files'),
			getFileFixture = getFixture('files/get_files_id');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadPath
				})
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get(fileDownloadPath)
				.reply(200, function() { return fs.createReadStream(testFilePath, 'utf8'); })
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				fileVersionID,
				`--destination=${fileDownloadPath}`,
				'-y',
				'--token=test'
			])
			.it('should download a file version ', ctx => {
				/* eslint-disable no-sync */
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);
				/* eslint-enable no-sync */
				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(ctx.stderr, 'Downloaded file test_file_download.txt\n');
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadPath
				})
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get(fileDownloadPath)
				.reply(200, function() { return fs.createReadStream(testFilePath, 'utf8'); })
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				`--destination=${fileDownloadPath}`,
				'-y',
				fileVersionID,
				'--token=test'
			])
			.it('should work with arguments in non-standard order', ctx => {
				/* eslint-disable no-sync */
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);
				/* eslint-enable no-sync */
				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(ctx.stderr, 'Downloaded file test_file_download.txt\n');
			});
	});

	describe('files:zip', () => {

		let fileName = 'test.zip',
			items = [
				{
					type: 'file',
					id: '466239504569'
				},
				{
					type: 'folder',
					id: '466239504580'
				}
			],
			testFilePath = path.join(__dirname, '..', 'fixtures/files/test_file.txt'),
			fileDownloadPath = path.join(__dirname, '..', 'fixtures/files'),
			expectedBody = {
				items,
				download_file_name: fileName
			},
			downloadUrl = '/2.0/zip_downloads/124hfiowk3fa8kmrwh/content',
			statusUrl = '/2.0/zip_downloads/124hfiowk3fa8kmrwh/status',
			createFileFixture = getFixture('files/post_zip_downloads'),
			downloadStatusFixture = getFixture('files/get_zip_downloads_status');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/zip_downloads', expectedBody)
				.reply(202, createFileFixture)
			)
			.nock(TEST_DOWNLOAD_ROOT, api => api
				.get(downloadUrl)
				.reply(200, function() { return fs.createReadStream(testFilePath, 'utf8'); })
			)
			.nock(TEST_API_ROOT, api => api
				.get(statusUrl)
				.reply(200, downloadStatusFixture)
			)
			.stdout()
			.command([
				'files:zip',
				fileName,
				`--item=${items[0].type}:${items[0].id}`,
				`--item=${items[1].type}:${items[1].id}`,
				`--destination=${fileDownloadPath}`,
				'--json',
				'--token=test'
			])
			.it('should create a zip of multiple files and folders and download it', ctx => {
				/* eslint-disable no-sync */
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);
				/* eslint-enable no-sync */
				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(ctx.stdout, downloadStatusFixture);
			});
	});
});
