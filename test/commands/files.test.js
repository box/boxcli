'use strict';
const { test } = require('@oclif/test');
const assert = require('chai').assert;
const fs = require('node:fs');
const path = require('node:path');
const {
	getFixture,
	TEST_API_ROOT,
	TEST_UPLOAD_ROOT,
	TEST_DOWNLOAD_ROOT,
	DEFAULT_DOWNLOAD_PATH,
	getDownloadProgressBar,
	toUrlPath,
} = require('../helpers/test-helper');
const os = require('node:os');
const leche = require('leche');

describe('Files', function () {
	describe('files:get', function () {
		let fileId = '1234567890',
			getFileFixture = getFixture('files/get_files_id'),
			yamlOutput = getFixture('output/files_get_yaml.txt');
		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${fileId}`).reply(200, getFileFixture)
		)
			.stdout()
			.command(['files:get', fileId, '--json', '--token=test'])
			.it("should get a file's information (JSON Output)", (context) => {
				assert.equal(context.stdout, getFileFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${fileId}`).reply(200, getFileFixture)
		)
			.stdout()
			.command(['files:get', fileId, '--token=test'])
			.it("should get a file's information (YAML Output)", (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.query({ fields: 'comment_count' })
				.reply(200, getFileFixture)
		)
			.stdout()
			.command([
				'files:get',
				fileId,
				'--fields=comment_count',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('files:copy', function () {
		let fileId = '1234567890',
			parentFolderId = '987654321',
			newName = 'Copied file.dat',
			version = '55555',
			copyFixture = getFixture('files/post_files_id_copy'),
			yamlOutput = getFixture('output/files_copy_yaml.txt');
		let copyBody = {
			parent: {
				id: parentFolderId,
			},
		};
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/files/${fileId}/copy`, copyBody)
				.reply(201, copyFixture)
		)
			.stdout()
			.command([
				'files:copy',
				fileId,
				parentFolderId,
				'--json',
				'--token=test',
			])
			.it(
				'should copy a file to a different folder (JSON Output)',
				(context) => {
					assert.equal(context.stdout, copyFixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/files/${fileId}/copy`, copyBody)
				.reply(201, copyFixture)
		)
			.stdout()
			.command(['files:copy', fileId, parentFolderId, '--token=test'])
			.it(
				'should copy a file to a different folder (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/files/${fileId}/copy`, copyBody)
				.reply(201, copyFixture)
		)
			.stdout()
			.command([
				'files:copy',
				fileId,
				parentFolderId,
				'--id-only',
				'--token=test',
			])
			.it(
				'should output only the ID of the copied file when --id-only flag is passed',
				(context) => {
					assert.equal(
						context.stdout,
						`${JSON.parse(copyFixture).id}${os.EOL}`
					);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
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
				'--token=test',
			])
			.it(
				'should send optional parameters when --name and --version flags are passed',
				(context) => {
					assert.equal(context.stdout, copyFixture);
				}
			);
	});

	describe('files:move', function () {
		let fileId = '1234567890',
			parentFolderId = '987654321',
			moveFixture = getFixture('files/put_files_id'),
			yamlOutput = getFixture('output/files_move_yaml.txt');
		let moveBody = {
			parent: {
				id: parentFolderId,
			},
		};
		test.nock(TEST_API_ROOT, (api) =>
			api.put(`/2.0/files/${fileId}`, moveBody).reply(200, moveFixture)
		)
			.stdout()
			.command([
				'files:move',
				fileId,
				parentFolderId,
				'--json',
				'--token=test',
			])
			.it(
				'should move a file to a different folder (JSON Output)',
				(context) => {
					assert.equal(context.stdout, moveFixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api.put(`/2.0/files/${fileId}`, moveBody).reply(200, moveFixture)
		)
			.stdout()
			.command(['files:move', fileId, parentFolderId, '--token=test'])
			.it(
				'should move a file to a different folder (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${fileId}`, moveBody)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message:
						'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide',
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
				'--token=test',
			])
			.it(
				'should send If-Match header and throw error when etag flag is passed but does not match',
				(context) => {
					let message =
						'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
					assert.equal(context.stderr, `${message}${os.EOL}`);
				}
			);
	});

	describe('files:delete', function () {
		let fileId = '1234567890';
		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/files/${fileId}`).reply(204)
		)
			.stderr()
			.command(['files:delete', fileId, '--token=test'])
			.it('should delete a file', (context) => {
				assert.equal(context.stderr, `Deleted file ${fileId}${os.EOL}`);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/files/${fileId}`).reply(204)
		)
			.stderr()
			.command(['files:delete', fileId, '--quiet', '--token=test'])
			.it(
				'should delete a file, but output no information to stderr',
				(context) => {
					assert.equal(context.stderr, '');
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/files/${fileId}`)
				.reply(204)
				.delete(`/2.0/files/${fileId}/trash`)
				.reply(204)
		)
			.stderr()
			.command(['files:delete', fileId, '-f', '--token=test'])
			.it(
				'should permanently delete a file when -f flag is passed',
				(context) => {
					assert.equal(
						context.stderr,
						`Deleted file ${fileId} permanently${os.EOL}`
					);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/files/${fileId}`)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message:
						'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide',
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
			.it(
				'should send If-Match header and throw error when etag flag is passed but does not match',
				(context) => {
					let message =
						'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
					assert.equal(context.stderr, `${message}${os.EOL}`);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/files/${fileId}`)
				.reply(204)
				.delete(`/2.0/files/${fileId}/trash`)
				.reply(404)
		)
			.stderr()
			.command(['files:delete', fileId, '-f', '--token=test'])
			.it(
				'should force delete successfully when user does not have trash enabled',
				(context) => {
					assert.equal(
						context.stderr,
						`Deleted file ${fileId} permanently${os.EOL}`
					);
				}
			);
	});

	describe('files:unlock', function () {
		let fileId = '1234567890',
			lockFixture = getFixture('files/put_files_id_lock'),
			yamlOutput = getFixture('output/files_unlock_yaml.txt');
		let unlockBody = {
			lock: null,
		};
		test.nock(TEST_API_ROOT, (api) =>
			api.put(`/2.0/files/${fileId}`, unlockBody).reply(200, lockFixture)
		)
			.stdout()
			.command(['files:unlock', fileId, '--json', '--token=test'])
			.it('should unlock a file (JSON Output)', (context) => {
				assert.equal(context.stdout, lockFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api.put(`/2.0/files/${fileId}`, unlockBody).reply(200, lockFixture)
		)
			.stdout()
			.command(['files:unlock', fileId, '--token=test'])
			.it('should unlock a file (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
	});
	leche.withData(['files:lock', 'files:update-lock'], function (command) {
		describe(command, function () {
			let fileId = '1234567890',
				expireTime = '2030-01-01T08:00:00+00:00',
				lockFixture = getFixture('files/put_files_id_lock'),
				yamlOutput = getFixture('output/files_lock_yaml.txt');
			let lockBody = {
				lock: {
					type: 'lock',
				},
			};
			test.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/files/${fileId}`, lockBody)
					.reply(200, lockFixture)
			)
				.stdout()
				.command([command, fileId, '--json', '--token=test'])
				.it('should lock a file (JSON Output)', (context) => {
					assert.equal(context.stdout, lockFixture);
				});
			test.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/files/${fileId}`, lockBody)
					.reply(200, lockFixture)
			)
				.stdout()
				.command([command, fileId, '--token=test'])
				.it('should lock a file (YAML Output)', (context) => {
					assert.equal(context.stdout, yamlOutput);
				});
			test.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/files/${fileId}`, {
						lock: {
							type: 'lock',
							is_download_prevented: true,
						},
					})
					.reply(200, lockFixture)
			)
				.stdout()
				.command([
					command,
					fileId,
					'--prevent-download',
					'--json',
					'--token=test',
				])
				.it(
					'should prevent download when the --prevent-download flag is passed',
					(context) => {
						assert.equal(context.stdout, lockFixture);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/files/${fileId}`, {
						lock: {
							type: 'lock',
							expires_at: expireTime,
						},
					})
					.reply(200, lockFixture)
			)
				.stdout()
				.command([
					command,
					fileId,
					`--expires=${expireTime}`,
					'--json',
					'--token=test',
				])
				.it(
					'should set the expiration time when the --expires flag is passed',
					(context) => {
						assert.equal(context.stdout, lockFixture);
					}
				);
		});
	});
	leche.withData(['files:comments', 'comments:list'], function (command) {
		describe(command, function () {
			let fileId = '1234567890',
				fixture = getFixture('comments/get_files_id_comments_page_1'),
				fixture2 = getFixture('comments/get_files_id_comments_page_2'),
				jsonOutput = getFixture('output/comments_list_json.txt');
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/files/${fileId}/comments`)
					.query({ limit: 1000 })
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/comments`)
					.query({
						offset: 2,
						limit: 1000,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([command, fileId, '--json', '--token=test'])
				.it(
					'should list all comments on a file (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/files/${fileId}/comments`)
					.query({ fields: 'message', limit: 1000 })
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/comments`)
					.query({
						fields: 'message',
						offset: 2,
						limit: 1000,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([
					command,
					fileId,
					'--fields=message',
					'--json',
					'--token=test',
				])
				.it(
					'should send fields param to the API when --fields flag is passed'
				);
		});
	});
	leche.withData(
		['files:collaborations', 'files:collaborations:list'],
		function (command) {
			describe(command, function () {
				let fileId = '1234567890',
					fixture = getFixture(
						'files/get_files_id_collaborations_page_1'
					),
					fixture2 = getFixture(
						'files/get_files_id_collaborations_page_2'
					),
					jsonOutput = getFixture(
						'output/files_collaborations_list_json.txt'
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.get(`/2.0/files/${fileId}/collaborations`)
						.query({ limit: 1000 })
						.reply(200, fixture)
						.get(`/2.0/files/${fileId}/collaborations`)
						.query({
							marker: 'ZAED53D',
							limit: 1000,
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([command, fileId, '--json', '--token=test'])
					.it(
						'should list all collaborations on a Box item (JSON Output)',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.get(`/2.0/files/${fileId}/collaborations`)
						.query({ fields: 'accessible_by', limit: 1000 })
						.reply(200, fixture)
						.get(`/2.0/files/${fileId}/collaborations`)
						.query({
							fields: 'accessible_by',
							marker: 'ZAED53D',
							limit: 1000,
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([
						command,
						fileId,
						'--fields=accessible_by',
						'--json',
						'--token=test',
					])
					.it(
						'should send fields param to the API when --fields flag is passed'
					);
			});
		}
	);

	describe('files:collaborations:add', function () {
		let fileId = '1234567890',
			addCollaborationFixture = getFixture(
				'files/post_collaborations_user'
			),
			yamlOutput = getFixture('output/files_collaborations_add_yaml.txt');
		let addCollaborationBody = {
			item: {
				type: 'file',
				id: fileId,
			},
			accessible_by: {
				type: 'user',
				login: 'newfriend@example.com',
			},
			role: 'previewer',
		};
		test.nock(TEST_API_ROOT, (api) =>
			api
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
				'--token=test',
			])
			.it(
				'should create a collaboration for a Box item (JSON Output)',
				(context) => {
					assert.equal(context.stdout, addCollaborationFixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/collaborations', addCollaborationBody)
				.reply(200, addCollaborationFixture)
		)
			.stdout()
			.command([
				'files:collaborations:add',
				fileId,
				'--previewer',
				'--login=newfriend@example.com',
				'--token=test',
			])
			.it(
				'should create a collaboration for a Box item (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
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
				'--token=test',
			])
			.it(
				'should output only the ID of the created collaboration when --id-only flag is passed',
				(context) => {
					assert.equal(
						context.stdout,
						`${JSON.parse(addCollaborationFixture).id}${os.EOL}`
					);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
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
				'--token=test',
			])
			.it('should work with args in non-standard order', (context) => {
				assert.equal(context.stdout, addCollaborationFixture);
			});
	});

	describe('files:rename', function () {
		let fileId = '1234567890',
			renameFixture = getFixture('files/put_files_id'),
			yamlOutput = getFixture('output/files_rename_yaml.txt');
		let renameBody = {
			name: 'test',
			description: 'test description',
		};
		test.nock(TEST_API_ROOT, (api) =>
			api
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
				'--token=test',
			])
			.it('should rename a file (JSON Output)', (context) => {
				assert.equal(context.stdout, renameFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${fileId}`, renameBody)
				.reply(200, renameFixture)
		)
			.stdout()
			.command([
				'files:rename',
				fileId,
				'test',
				'--description=test description',
				'--token=test',
			])
			.it('should rename a file (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${fileId}`, renameBody)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message:
						'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide',
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
			.it(
				'should send If-Match header and throw error when etag flag is passed but does not match',
				(context) => {
					let message =
						'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
					assert.equal(context.stderr, `${message}${os.EOL}`);
				}
			);
	});

	describe('files:metadata:get', function () {
		let fileId = '1234567890',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			getMetadataFixture = getFixture(
				'files/get_files_id_metadata_scope_template'
			),
			yamlOutput = getFixture('output/files_metadata_get_yaml.txt');
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`
				)
				.reply(200, getMetadataFixture)
		)
			.stdout()
			.command([
				'files:metadata:get',
				fileId,
				`--template-key=${metadataTemplate}`,
				'--json',
				'--token=test',
			])
			.it(
				'should get information about a metadata object (JSON Output)',
				(context) => {
					assert.equal(context.stdout, getMetadataFixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`
				)
				.reply(200, getMetadataFixture)
		)
			.stdout()
			.command([
				'files:metadata:get',
				fileId,
				`--template-key=${metadataTemplate}`,
				'--token=test',
			])
			.it(
				'should get information about a metadata object (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
	});
	leche.withData(
		['files:metadata', 'files:metadata:get-all'],
		function (command) {
			describe(command, function () {
				let fileId = '123456789',
					getAllMetadataFixture = getFixture(
						'files/get_files_id_metadata'
					),
					jsonOutput = getFixture(
						'output/files_metadata_get_all_json.txt'
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.get(`/2.0/files/${fileId}/metadata`)
						.reply(200, getAllMetadataFixture)
				)
					.stdout()
					.command([command, fileId, '--json', '--token=test'])
					.it('should get all metadata on a Box item', (context) => {
						assert.equal(context.stdout, jsonOutput);
					});
			});
		}
	);
	leche.withData(
		['files:metadata:remove', 'files:metadata:delete'],
		function (command) {
			describe(command, function () {
				let fileId = '1234567890',
					metadataScope = 'enterprise',
					metadataTemplate = 'testTemplate';
				test.nock(TEST_API_ROOT, (api) =>
					api
						.delete(
							`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`
						)
						.reply(204)
				)
					.stderr()
					.command([
						command,
						fileId,
						`--template-key=${metadataTemplate}`,
						'--token=test',
					])
					.it('should delete metadata from an item', (context) => {
						assert.equal(
							context.stderr,
							`Successfully deleted metadata ${metadataTemplate}${os.EOL}`
						);
					});
			});
		}
	);

	describe('files:metadata:update', function () {
		let fileId = '1234567890',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			getMetadataFixture = getFixture(
				'files/get_files_id_metadata_scope_template'
			),
			yamlOutput = getFixture('output/files_metadata_update_yaml.txt');
		let updateMetadataBody = [
			{
				op: 'test',
				path: '/numReviewsLeft',
				value: 1,
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
			},
		];
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`,
					updateMetadataBody
				)
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
				'--token=test',
			])
			.it('should update metadata object (JSON Output)', (context) => {
				assert.equal(context.stdout, getMetadataFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`,
					updateMetadataBody
				)
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
				'--token=test',
			])
			.it('should update metadata object (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
	});
	leche.withData(
		['files:metadata:add', 'files:metadata:create'],
		function (command) {
			describe(command, function () {
				let fileId = '1234567890',
					metadataScope = 'enterprise',
					metadataTemplate = 'testTemplate',
					addMetadataFixture = getFixture(
						'files/post_files_id_metadata_scope_template'
					),
					yamlOutput = getFixture(
						'output/files_metadata_create_yaml.txt'
					);
				let createMetadataBody = {
					test: 'test123',
					number: 1.9,
					arr: ['foo', 'bar'],
				};
				test.nock(TEST_API_ROOT, (api) =>
					api
						.post(
							`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`,
							createMetadataBody
						)
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
						'--token=test',
					])
					.it(
						'should add metadata object (JSON Output)',
						(context) => {
							assert.equal(context.stdout, addMetadataFixture);
						}
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.post(
							`/2.0/files/${fileId}/metadata/${metadataScope}/${metadataTemplate}`,
							createMetadataBody
						)
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
						'--token=test',
					])
					.it(
						'should add metadata object (YAML Output)',
						(context) => {
							assert.equal(context.stdout, yamlOutput);
						}
					);
			});
		}
	);

	describe('files:metadata:set', function () {
		let fileID = '11111',
			metadataScope = 'enterprise',
			metadataTemplate = 'testTemplate',
			addMetadataFixture = getFixture(
				'files/post_files_id_metadata_scope_template'
			),
			yamlOutput = getFixture('output/files_metadata_create_yaml.txt');
		let createMetadataBody = {
			test: 'test123',
			number: 1.9,
			arr: ['foo', 'bar'],
		};
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`,
					createMetadataBody
				)
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
				'--token=test',
			])
			.it(
				'should add metadata object with key/value pairs passed as a flag (JSON Output)',
				(context) => {
					assert.equal(context.stdout, addMetadataFixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`,
					createMetadataBody
				)
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
				'--token=test',
			])
			.it(
				'should add metadata object with key/value pairs passed as a flag (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`,
					createMetadataBody
				)
				.reply(409)
				.put(
					`/2.0/files/${fileID}/metadata/${metadataScope}/${metadataTemplate}`,
					[
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
							value: ['foo', 'bar'],
						},
					]
				)
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
				'--token=test',
			])
			.it(
				'should update metadata object with key/value pairs passed as a flag when creation conflicts',
				(context) => {
					assert.equal(context.stdout, addMetadataFixture);
				}
			);
	});
	leche.withData(
		[
			'files:share',
			'files:shared-links:create',
			'files:shared-links:update',
		],
		function (command) {
			describe(command, function () {
				let fileId = '1234567890',
					vanityName = 'my-custom-name-123',
					unsharedDate = '2030-11-18T19:44:17+00:00',
					createSharedLinkFixture = getFixture(
						'files/put_files_id_shared_link'
					),
					jsonOutput = getFixture('output/files_share_json.txt'),
					yamlOutput = getFixture('output/files_share_yaml.txt');
				let sharedLinkBody = {
					shared_link: {
						permissions: { can_download: true, can_edit: true },
						access: 'test',
						password: 'test',
						vanity_name: vanityName,
					},
				};
				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(
							`/2.0/files/${fileId}?fields=shared_link`,
							sharedLinkBody
						)
						.reply(200, createSharedLinkFixture)
				)
					.stdout()
					.command([
						command,
						fileId,
						'--access=test',
						'--password=test',
						'--can-download',
						`--vanity-name=${vanityName}`,
						'--can-edit',
						'--json',
						'--token=test',
					])
					.it(
						'should create a shared link for a Box item (JSON Output)',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(
							`/2.0/files/${fileId}?fields=shared_link`,
							sharedLinkBody
						)
						.reply(200, createSharedLinkFixture)
				)
					.stdout()
					.command([
						command,
						fileId,
						'--access=test',
						'--password=test',
						'--can-download',
						`--vanity-name=${vanityName}`,
						'--can-edit',
						'--token=test',
					])
					.it(
						'should create a shared link for a Box item (YAML Output)',
						(context) => {
							assert.equal(context.stdout, yamlOutput);
						}
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(`/2.0/files/${fileId}?fields=shared_link`, {
							shared_link: {
								permissions: {},
								unshared_at: unsharedDate,
							},
						})
						.reply(200, createSharedLinkFixture)
				)
					.stdout()
					.command([
						command,
						fileId,
						`--unshared-at=${unsharedDate}`,
						'--json',
						'--token=test',
					])
					.it(
						'should send unshared_at param when --unshared-at flag is passed',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(`/2.0/files/${fileId}?fields=shared_link`, {
							shared_link: {
								permissions: {},
								unshared_at: unsharedDate,
							},
						})
						.reply(200, createSharedLinkFixture)
				)
					.stdout()
					.command([
						command,
						`--unshared-at=${unsharedDate}`,
						'--json',
						fileId,
						'--token=test',
					])
					.it(
						'should work with args in non-standard order',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
			});
		}
	);
	leche.withData(
		['files:unshare', 'files:shared-links:delete'],
		function (command) {
			describe(command, function () {
				let fileId = '1234567809',
					getFileFixture = getFixture('files/get_files_id');
				let deleteSharedLinkBody = {
					shared_link: null,
				};
				test.nock(TEST_API_ROOT, (api) =>
					api
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
						'--token=test',
					])
					.it('should delete a shared link for a file', (context) => {
						assert.equal(context.stdout, '');
						assert.equal(
							context.stderr,
							`Removed shared link from file "test_file_download.txt"${os.EOL}`
						);
					});
				test.nock(TEST_API_ROOT, (api) =>
					api
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
						fileId,
					])
					.it(
						'should work with args in non-standard order',
						(context) => {
							assert.equal(context.stdout, '');
							assert.equal(
								context.stderr,
								`Removed shared link from file "test_file_download.txt"${os.EOL}`
							);
						}
					);
			});
		}
	);
	leche.withData(['files:tasks', 'files:tasks:list'], function (command) {
		describe(command, function () {
			let fileId = '1234567890',
				fixture = getFixture('files/get_files_id_tasks_page_1'),
				fixture2 = getFixture('files/get_files_id_tasks_page_2'),
				jsonOutput = getFixture('output/files_tasks_list_json.txt');
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/files/${fileId}/tasks`)
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/tasks`)
					.query({
						offset: 1,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([command, fileId, '--json', '--token=test'])
				.it(
					'should list all tasks on this file (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/files/${fileId}/tasks`)
					.query({ fields: 'id' })
					.reply(200, fixture)
					.get(`/2.0/files/${fileId}/tasks`)
					.query({
						fields: 'id',
						offset: 1,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([
					command,
					fileId,
					'--fields=id',
					'--json',
					'--token=test',
				])
				.it(
					'should send fields param to the API when --fields flag is passed'
				);
		});
	});
	leche.withData(
		['files:versions', 'files:versions:list'],
		function (command) {
			describe(command, function () {
				let fileId = '1234567890',
					fixture = getFixture('files/get_files_id_versions_page_1'),
					fixture2 = getFixture('files/get_files_id_versions_page_2'),
					jsonOutput = getFixture(
						'output/files_versions_list_json.txt'
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.get(`/2.0/files/${fileId}/versions`)
						.query({ limit: 1000 })
						.reply(200, fixture)
						.get(`/2.0/files/${fileId}/versions`)
						.query({
							offset: 2,
							limit: 1000,
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([command, fileId, '--json', '--token=test'])
					.it(
						'should get a list of file versions (JSON Output)',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
				test.nock(TEST_API_ROOT, (api) =>
					api
						.get(`/2.0/files/${fileId}/versions`)
						.query({ fields: 'sha1', limit: 1000 })
						.reply(200, fixture)
						.get(`/2.0/files/${fileId}/versions`)
						.query({
							fields: 'sha1',
							offset: 2,
							limit: 1000,
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([
						command,
						fileId,
						'--fields=sha1',
						'--json',
						'--token=test',
					])
					.it(
						'should send fields param to the API when --fields flag is passed'
					);
			});
		}
	);

	describe('files:versions:delete', function () {
		let fileId = '1234567890',
			versionId = '1234567890';
		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/files/${fileId}/versions/${versionId}`).reply(204)
		)
			.stderr()
			.command([
				'files:versions:delete',
				fileId,
				versionId,
				'--token=test',
			])
			.it('should delete a file version', (context) => {
				assert.equal(
					context.stderr,
					`Deleted file version ${versionId} from file ${fileId}${os.EOL}`
				);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/files/${fileId}/versions/${versionId}`)
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message:
						'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide',
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
			.it(
				'should send If-Match header and throw error when etag flag is passed but does not match',
				(context) => {
					let message =
						'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
					assert.equal(context.stderr, `${message}${os.EOL}`);
				}
			);
	});

	describe('files:versions:promote', function () {
		let fileId = '1234567890',
			versionId = '1234567890',
			promoteVersionFixture = getFixture(
				'files/post_files_id_versions_current'
			),
			yamlOutput = getFixture('output/files_versions_promote_yaml.txt');
		let promoteVersionBody = {
			type: 'file_version',
			id: versionId,
		};
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					`/2.0/files/${fileId}/versions/current`,
					promoteVersionBody
				)
				.reply(201, promoteVersionFixture)
		)
			.stdout()
			.command([
				'files:versions:promote',
				fileId,
				versionId,
				'--json',
				'--token=test',
			])
			.it('should promote a file version (JSON Output)', (context) => {
				assert.equal(context.stdout, promoteVersionFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					`/2.0/files/${fileId}/versions/current`,
					promoteVersionBody
				)
				.reply(201, promoteVersionFixture)
		)
			.stdout()
			.command([
				'files:versions:promote',
				fileId,
				versionId,
				'--token=test',
			])
			.it('should promote a file version (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
	});

	describe('files:update', function () {
		let fileID = '55555',
			name = 'Document v1.pdf',
			description = 'New description',
			tags = 'foo,bar',
			fixture = getFixture('files/put_files_id'),
			yamlOutput = getFixture('output/files_rename_yaml.txt'),
			dispositionAt = '2025-12-09T04:07:18-08:00';
		test.nock(TEST_API_ROOT, (api) =>
			api.put(`/2.0/files/${fileID}`, { name }).reply(200, fixture)
		)
			.stdout()
			.command([
				'files:update',
				fileID,
				`--name=${name}`,
				'--json',
				'--token=test',
			])
			.it(
				'should update a file with name flag passed (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api.put(`/2.0/files/${fileID}`, { name }).reply(200, fixture)
		)
			.stdout()
			.command(['files:update', fileID, `--name=${name}`, '--token=test'])
			.it(
				'should update a file with name flag passed (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
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
				'--token=test',
			])
			.it(
				'should send optional params when flags are passed',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${fileID}`, { name })
				.matchHeader('If-Match', '5')
				.reply(412, {
					type: 'error',
					status: 412,
					code: 'precondition_failed',
					help_url: 'http://developers.box.com/docs/#errors',
					message:
						'The resource has been modified. Please retrieve the resource again and retry',
					request_id: '1wne91fxf8871ide',
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
			.it(
				'should send If-Match header and throw error when etag flag is passed but does not match',
				(context) => {
					let message =
						'Unexpected API Response [412 Precondition Failed | 1wne91fxf8871ide] precondition_failed - The resource has been modified. Please retrieve the resource again and retry';
					assert.equal(context.stderr, `${message}${os.EOL}`);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${fileID}`, {
					disposition_at: dispositionAt,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'files:update',
				fileID,
				`--disposition-at=${dispositionAt}`,
				'--json',
				'--token=test',
			])
			.it('shoud update disposition_at property of a file', (context) => {
				assert.equal(context.stdout, fixture);
			});
	});

	describe('files:versions:upload', function () {
		let fileId = '1234567890',
			testFileName = 'test_file.txt',
			testFileContent = 'hello',
			contentModifiedAt = '2012-12-20T20:20:12+00:00',
			testFilePath = path.join(
				__dirname,
				'..',
				`fixtures/files/${testFileName}`
			),
			uploadFileFixture = getFixture('files/post_files_content'),
			jsonOutput = getFixture('output/files_versions_upload_json.txt'),
			yamlOutput = getFixture('output/files_versions_upload_yaml.txt');
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post(`/2.0/files/${fileId}/content`, function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						assert.match(lines[0], /^-+[a-f0-9]+$/u);
						assert.equal(
							lines[1],
							'Content-Disposition: form-data; name="attributes"'
						);
						assert.equal(lines[2], '');
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.match(lines[4], /^-+[a-f0-9]+$/u);
						assert.equal(
							lines[5],
							'Content-Disposition: form-data; name="content"; filename="unused"'
						);
						assert.equal(lines[6], 'Content-Type: text/plain');
						assert.equal(lines[7], '');
						assert.equal(lines[8], testFileContent);
						assert.match(lines[9], /^-+[a-f0-9]+-+$/u);
					} catch {
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
				'--token=test',
			])
			.it(
				'should upload a new version of a file (JSON Output)',
				(context) => {
					assert.equal(context.stdout, jsonOutput);
				}
			);
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post(`/2.0/files/${fileId}/content`, function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						assert.match(lines[0], /^-+[a-f0-9]+$/u);
						assert.equal(
							lines[1],
							'Content-Disposition: form-data; name="attributes"'
						);
						assert.equal(lines[2], '');
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.match(lines[4], /^-+[a-f0-9]+$/u);
						assert.equal(
							lines[5],
							'Content-Disposition: form-data; name="content"; filename="unused"'
						);
						assert.equal(lines[6], 'Content-Type: text/plain');
						assert.equal(lines[7], '');
						assert.equal(lines[8], testFileContent);
						assert.match(lines[9], /^-+[a-f0-9]+-+$/u);
					} catch {
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
				'--token=test',
			])
			.it(
				'should upload a new version of a file (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post(`/2.0/files/${fileId}/content`, function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(
							attributes,
							'content_modified_at',
							contentModifiedAt
						);
						assert.equal(lines[8], testFileContent);
					} catch {
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
				'--token=test',
			])
			.it(
				'should upload file with content timestamp when --content-modified-at flag is passed',
				(context) => {
					assert.equal(context.stdout, jsonOutput);
				}
			);
	});

	describe('files:upload', function () {
		let parentFolderId = '987654321',
			testFileName = 'test_file.txt',
			newFileName = 'renamed_file.txt',
			testFileContent = 'hello',
			contentCreatedAt = '2017-02-03T12:34:56+00:00',
			contentModifiedAt = '2017-11-18T09:12:44+00:00',
			testFilePath = path.join(
				__dirname,
				'..',
				`fixtures/files/${testFileName}`
			),
			uploadFileFixture = getFixture('files/post_files_content'),
			jsonOutput = getFixture('output/files_upload_json.txt'),
			yamlOutput = getFixture('output/files_upload_yaml.txt');
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post('/2.0/files/content', function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.nestedPropertyVal(
							attributes,
							'parent.id',
							parentFolderId
						);
						assert.equal(lines[8], testFileContent);
					} catch {
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
				'--token=test',
			])
			.it('should upload a file (JSON Output)', (context) => {
				assert.equal(context.stdout, jsonOutput);
			});
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post('/2.0/files/content', function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.nestedPropertyVal(
							attributes,
							'parent.id',
							parentFolderId
						);
						assert.equal(lines[8], testFileContent);
					} catch {
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
				'--token=test',
			])
			.it('should upload a file (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post('/2.0/files/content', function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', testFileName);
						assert.nestedPropertyVal(
							attributes,
							'parent.id',
							parentFolderId
						);
						assert.equal(lines[8], testFileContent);
					} catch {
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
				'--token=test',
			])
			.it(
				'should output only the ID of the new file when --id-only flag is passed',
				(context) => {
					assert.include(
						context.stdout,
						JSON.parse(uploadFileFixture).entries[0].id
					);
				}
			);
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post('/2.0/files/content', function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(attributes, 'name', newFileName);
						assert.nestedPropertyVal(
							attributes,
							'parent.id',
							parentFolderId
						);
						assert.equal(lines[8], testFileContent);
					} catch {
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
				'--token=test',
			])
			.it(
				'should upload file with new name when --name flag is passed',
				(context) => {
					assert.equal(context.stdout, jsonOutput);
				}
			);
		test.nock(TEST_UPLOAD_ROOT, (api) =>
			api
				.post('/2.0/files/content', function (body) {
					try {
						let lines = body.split(/\r?\n/u);
						let attributes = JSON.parse(lines[3]);
						assert.propertyVal(
							attributes,
							'content_created_at',
							contentCreatedAt
						);
						assert.propertyVal(
							attributes,
							'content_modified_at',
							contentModifiedAt
						);
						assert.nestedPropertyVal(
							attributes,
							'parent.id',
							parentFolderId
						);
						assert.equal(lines[8], testFileContent);
					} catch {
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
				'--token=test',
			])
			.it(
				'should upload file with content timestamps when --content-*-at flags are passed',
				(context) => {
					assert.equal(context.stdout, jsonOutput);
				}
			);
	});

	describe('files:download', function () {
		let fileId = '12345',
			fileName = 'test_file_download.txt',
			saveAsFileName = 'new_file_name.txt',
			fileVersionID = '8764569',
			testFilePath = path.join(
				__dirname,
				'..',
				'fixtures/files/epic-poem.txt'
			),
			testFileStat = fs.statSync(testFilePath),
			fileDownloadPath = path.join(__dirname, '..', 'fixtures/files'),
			fileDownloadUrl = toUrlPath(fileDownloadPath),
			temporaryDestinationPath = path.join(fileDownloadPath, 'filesTemp'),
			temporaryDestinationPath2 = path.join(
				fileDownloadPath,
				'filesTemp2'
			),
			getFileFixture = getFixture('files/get_files_id'),
			testFileInfo = JSON.parse(getFileFixture);
		testFileInfo.size = testFileStat.size;

		after(function () {
			fs.rmdirSync(temporaryDestinationPath);
			fs.rmdirSync(temporaryDestinationPath2);
		});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, JSON.stringify(testFileInfo))
				.get(`/2.0/files/${fileId}/content`)
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--destination=${fileDownloadPath}`,
				'-y',
				'--token=test',
			])
			.it('should download a file', (context) => {
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				let downloadedFileStat = fs.statSync(downloadedFilePath);
				assert.equal(testFileStat.size, downloadedFileStat.size);
				fs.unlinkSync(downloadedFilePath);

				assert.ok(downloadContent.equals(expectedContent));
				let expectedMessage = getDownloadProgressBar(testFileStat.size);
				expectedMessage += `Downloaded file test_file_download.txt${os.EOL}`;
				assert.equal(context.stderr, expectedMessage);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--destination=${temporaryDestinationPath}`,
				'-y',
				'--token=test',
			])
			.it('should download a file to a non-existing destination', () => {
				let downloadedFilePath = path.join(
					temporaryDestinationPath,
					fileName
				);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);

				assert.ok(downloadContent.equals(expectedContent));
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command(['files:download', fileId, '-y', '--token=test'])
			.it('should download a file to a default destination', () => {
				let downloadedFilePath = path.join(
					DEFAULT_DOWNLOAD_PATH,
					fileName
				);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);

				assert.ok(downloadContent.equals(expectedContent));
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--save-as=${saveAsFileName}`,
				`--destination=${temporaryDestinationPath2}`,
				'-y',
				'--token=test',
			])
			.it(
				'should save downloaded file using provided filename in save-as parameter',
				() => {
					let downloadedFilePath = path.join(
						temporaryDestinationPath2,
						saveAsFileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.do(() => {
				fs.writeFileSync(
					path.join(DEFAULT_DOWNLOAD_PATH, saveAsFileName),
					'foo',
					'utf8'
				);
			})
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--save-as=${saveAsFileName}`,
				'--overwrite',
				'--token=test',
			])
			.it(
				'should overwrite downloaded file when --overwrite flag is used',
				() => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						saveAsFileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${fileId}`).reply(200, getFileFixture)
		)
			.do(() => {
				fs.writeFileSync(
					path.join(DEFAULT_DOWNLOAD_PATH, saveAsFileName),
					'foo',
					'utf8'
				);
			})
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--save-as=${saveAsFileName}`,
				'--no-overwrite',
				'--token=test',
			])
			.it(
				'should skip downloading when file exists and --no-overwrite flag is used',
				(context) => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						saveAsFileName
					);
					fs.unlinkSync(downloadedFilePath);

					assert.equal(
						context.stderr,
						`Downloading the file will not occur because the file ${downloadedFilePath} already exists, and the --no-overwrite flag is set.${os.EOL}`
					);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, JSON.stringify(testFileInfo))
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:download',
				fileId,
				`--destination=${fileDownloadPath}`,
				`--version=${fileVersionID}`,
				'-y',
				'--token=test',
			])
			.it(
				'should download a file version when version flag is passed',
				(context) => {
					let downloadedFilePath = path.join(
						fileDownloadPath,
						fileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					let downloadedFileStat = fs.statSync(downloadedFilePath);
					assert.equal(testFileStat.size, downloadedFileStat.size);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
					let expectedMessage = getDownloadProgressBar(
						testFileStat.size
					);
					expectedMessage += `Downloaded file test_file_download.txt${os.EOL}`;
					assert.equal(context.stderr, expectedMessage);
				}
			);
	});

	describe('files:versions:download', function () {
		let fileId = '12345',
			fileName = 'test_file_download.txt',
			saveAsFileName = 'new_file_name.txt',
			fileVersionID = '8764569',
			testFilePath = path.join(
				__dirname,
				'..',
				'fixtures/files/epic-poem.txt'
			),
			fileDownloadPath = path.join(__dirname, '..', 'fixtures/files'),
			fileDownloadUrl = toUrlPath(fileDownloadPath),
			temporaryDestinationPath = path.join(
				fileDownloadPath,
				'versionsTemp'
			),
			temporaryDestinationPath2 = path.join(
				fileDownloadPath,
				'versionsTemp2'
			),
			getFileFixture = getFixture('files/get_files_id');

		after(function () {
			fs.rmdirSync(temporaryDestinationPath);
			fs.rmdirSync(temporaryDestinationPath2);
		});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				fileVersionID,
				`--destination=${fileDownloadPath}`,
				'-y',
				'--token=test',
			])
			.it('should download a file version ', (context) => {
				let downloadedFilePath = path.join(fileDownloadPath, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);

				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(
					context.stderr,
					`Downloaded file test_file_download.txt${os.EOL}`
				);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				`--destination=${fileDownloadPath}`,
				'-y',
				fileVersionID,
				'--token=test',
			])
			.it(
				'should work with arguments in non-standard order',
				(context) => {
					let downloadedFilePath = path.join(
						fileDownloadPath,
						fileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
					assert.equal(
						context.stderr,
						`Downloaded file test_file_download.txt${os.EOL}`
					);
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				'-y',
				fileVersionID,
				'--token=test',
			])
			.it(
				'should download a file version to a default destination',
				() => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						fileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				`--destination=${temporaryDestinationPath}`,
				'-y',
				fileVersionID,
				'--token=test',
			])
			.it(
				'should download a file version to a non-existing destination',
				() => {
					let downloadedFilePath = path.join(
						temporaryDestinationPath,
						fileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				`--save-as=${saveAsFileName}`,
				`--destination=${temporaryDestinationPath2}`,
				'-y',
				fileVersionID,
				'--token=test',
			])
			.it(
				'should save downloaded file version using provided filename in save-as parameter',
				() => {
					let downloadedFilePath = path.join(
						temporaryDestinationPath2,
						saveAsFileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/files/${fileId}`)
				.reply(200, getFileFixture)
				.get(`/2.0/files/${fileId}/content`)
				.query({ version: fileVersionID })
				.reply(302, '', {
					Location: TEST_DOWNLOAD_ROOT + fileDownloadUrl,
				})
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(fileDownloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.do(() => {
				fs.writeFileSync(
					path.join(DEFAULT_DOWNLOAD_PATH, saveAsFileName),
					'foo',
					'utf8'
				);
			})
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				`--save-as=${saveAsFileName}`,
				'--overwrite',
				fileVersionID,
				'--token=test',
			])
			.it(
				'should overwrite downloaded file version when --overwrite flag is used',
				() => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						saveAsFileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
				}
			);
		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${fileId}`).reply(200, getFileFixture)
		)
			.do(() => {
				fs.writeFileSync(
					path.join(DEFAULT_DOWNLOAD_PATH, saveAsFileName),
					'foo',
					'utf8'
				);
			})
			.stdout()
			.stderr()
			.command([
				'files:versions:download',
				fileId,
				fileVersionID,
				`--save-as=${saveAsFileName}`,
				'--no-overwrite',
				'--token=test',
			])
			.it(
				'should skip downloading when file exists and --no-overwrite flag is used',
				(context) => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						saveAsFileName
					);
					fs.unlinkSync(downloadedFilePath);

					assert.equal(
						context.stderr,
						`Downloading the file will not occur because the file ${downloadedFilePath} already exists, and the --no-overwrite flag is set.${os.EOL}`
					);
				}
			);
	});

	describe('files:zip', function () {
		let fileName = 'test.zip',
			items = [
				{
					type: 'file',
					id: '466239504569',
				},
				{
					type: 'folder',
					id: '466239504580',
				},
			],
			testFilePath = path.join(
				__dirname,
				'..',
				'fixtures/files/test_file.txt'
			),
			fileDownloadPath = path.join(__dirname, '..', 'fixtures/files'),
			expectedBody = {
				items,
				download_file_name: fileName,
			},
			downloadUrl = '/2.0/zip_downloads/124hfiowk3fa8kmrwh/content',
			statusUrl = '/2.0/zip_downloads/124hfiowk3fa8kmrwh/status',
			createFileFixture = getFixture('files/post_zip_downloads'),
			downloadStatusFixture = getFixture(
				'files/get_zip_downloads_status'
			);
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/zip_downloads', expectedBody)
				.reply(202, createFileFixture)
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(downloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.nock(TEST_API_ROOT, (api) =>
				api.get(statusUrl).reply(200, downloadStatusFixture)
			)
			.stdout()
			.command([
				'files:zip',
				fileName,
				`--item=${items[0].type}:${items[0].id}`,
				`--item=${items[1].type}:${items[1].id}`,
				`--destination=${fileDownloadPath}`,
				'--json',
				'--token=test',
			])
			.it(
				'should create a zip of multiple files and folders and download it',
				(context) => {
					let downloadedFilePath = path.join(
						fileDownloadPath,
						fileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
					assert.equal(context.stdout, downloadStatusFixture);
				}
			);
		const destination = path.join(fileDownloadPath, 'temp');
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/zip_downloads', expectedBody)
				.reply(202, createFileFixture)
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(downloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.nock(TEST_API_ROOT, (api) =>
				api.get(statusUrl).reply(200, downloadStatusFixture)
			)
			.stdout()
			.command([
				'files:zip',
				fileName,
				`--item=${items[0].type}:${items[0].id}`,
				`--item=${items[1].type}:${items[1].id}`,
				`--destination=${destination}`,
				'--json',
				'--token=test',
			])
			.it('should create a zip in a non-existent path', (context) => {
				let downloadedFilePath = path.join(destination, fileName);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);
				fs.rmdirSync(destination, { recursive: true, force: true });

				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(context.stdout, downloadStatusFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/zip_downloads', expectedBody)
				.reply(202, createFileFixture)
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(downloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.nock(TEST_API_ROOT, (api) =>
				api.get(statusUrl).reply(200, downloadStatusFixture)
			)
			.stdout()
			.command([
				'files:zip',
				fileName,
				`--item=${items[0].type}:${items[0].id}`,
				`--item=${items[1].type}:${items[1].id}`,
				'--json',
				'--token=test',
			])
			.it('should create a zip in a default destination', (context) => {
				let downloadedFilePath = path.join(
					DEFAULT_DOWNLOAD_PATH,
					fileName
				);
				let downloadContent = fs.readFileSync(downloadedFilePath);
				let expectedContent = fs.readFileSync(testFilePath);
				fs.unlinkSync(downloadedFilePath);

				assert.ok(downloadContent.equals(expectedContent));
				assert.equal(context.stdout, downloadStatusFixture);
			});
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/zip_downloads', expectedBody)
				.reply(202, createFileFixture)
		)
			.nock(TEST_DOWNLOAD_ROOT, (api) =>
				api.get(downloadUrl).reply(200, function () {
					return fs.createReadStream(testFilePath, 'utf8');
				})
			)
			.nock(TEST_API_ROOT, (api) =>
				api.get(statusUrl).reply(200, downloadStatusFixture)
			)
			.do(async () => {
				await fs.writeFileSync(
					path.join(DEFAULT_DOWNLOAD_PATH, fileName),
					'foo'
				);
			})
			.stdout()
			.command([
				'files:zip',
				fileName,
				`--item=${items[0].type}:${items[0].id}`,
				`--item=${items[1].type}:${items[1].id}`,
				'--overwrite',
				'--json',
				'--token=test',
			])
			.it(
				'should overwrite downloaded zip file when --overwrite flag is used',
				(context) => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						fileName
					);
					let downloadContent = fs.readFileSync(downloadedFilePath);
					let expectedContent = fs.readFileSync(testFilePath);
					fs.unlinkSync(downloadedFilePath);

					assert.ok(downloadContent.equals(expectedContent));
					assert.equal(context.stdout, downloadStatusFixture);
				}
			);
		test.do(async () => {
			await fs.writeFileSync(
				path.join(DEFAULT_DOWNLOAD_PATH, fileName),
				'foo'
			);
		})
			.stdout()
			.stderr()
			.command([
				'files:zip',
				fileName,
				`--item=${items[0].type}:${items[0].id}`,
				`--item=${items[1].type}:${items[1].id}`,
				'--no-overwrite',
				'--json',
				'--token=test',
			])
			.it(
				'should skip downloading zip file when exists and --no-overwrite flag is used',
				(context) => {
					let downloadedFilePath = path.join(
						DEFAULT_DOWNLOAD_PATH,
						fileName
					);
					fs.unlinkSync(downloadedFilePath);

					assert.equal(
						context.stderr,
						`Downloading the file will not occur because the file ${downloadedFilePath} already exists, and the --no-overwrite flag is set.${os.EOL}`
					);
				}
			);
	});
});
