'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const leche = require('leche');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');

describe('Collaborations', function () {
	describe('collaborations:get', function () {
		let collaborationId = '1234567890',
			fixture = getFixture('collaborations/get_collaborations_id'),
			yamlOutput = getFixture('output/collaborations_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/collaborations/${collaborationId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaborations:get',
				collaborationId,
				'--json',
				'--token=test',
			])
			.it(
				'should get an individual collaboration (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/collaborations/${collaborationId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command(['collaborations:get', collaborationId, '--token=test'])
			.it(
				'should get an individual collaboration (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/collaborations/${collaborationId}`)
				.query({ fields: 'status,role' })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaborations:get',
				collaborationId,
				'--fields=status,role',
				'--token=test',
			])
			.it(
				'should send fields param and filter output when --fields flag is passed',
				(context) => {
					let lb = '\n';
					assert.equal(
						context.stdout,
						`Type: collaboration${lb}ID: '1234567890'${lb}Status: accepted${lb}Role: editor${os.EOL}`
					);
				}
			);
	});

	leche.withData(
		[
			'collaborations:update',
			'files:collaborations:update',
			'folders:collaborations:update',
		],
		function (command) {

			describe(command, function () {
				let collaborationId = '1234567890',
					fixture = getFixture(
						'collaborations/put_collaborations_id'
					),
					yamlOutput = getFixture(
						'output/collaborations_update_yaml.txt'
					);

				let collaborationBody = {
					role: 'viewer',
					status: 'accepted',
				};

				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(
							`/2.0/collaborations/${collaborationId}`,
							collaborationBody
						)
						.reply(200, fixture)
				)
					.stdout()
					.command([
						command,
						collaborationId,
						'--viewer',
						'--status=accepted',
						'--json',
						'--token=test',
					])
					.it(
						'should update a collaboration with viewer and status flags passed (JSON Output)',
						(context) => {
							assert.equal(context.stdout, fixture);
						}
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(
							`/2.0/collaborations/${collaborationId}`,
							collaborationBody
						)
						.reply(200, fixture)
				)
					.stdout()
					.command([
						command,
						collaborationId,
						'--viewer',
						'--status=accepted',
						'--token=test',
					])
					.it(
						'should update a collaboration with viewer and status flags passed (YAML Output)',
						(context) => {
							assert.equal(context.stdout, yamlOutput);
						}
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(`/2.0/collaborations/${collaborationId}`, {
							role: 'owner',
						})
						.reply(204)
				)
					.stdout()
					.stderr()
					.command([
						command,
						collaborationId,
						'--role=owner',
						'--token=test',
					])
					.it(
						'should print a success message after updating collab role to owner',
						(context) => {
							assert.equal(
								context.stderr,
								`Collaborator successfully upgraded to owner.${os.EOL}`
							);
						}
					);

				leche.withData(
					{
						'editor flag': ['--editor', 'editor'],
						'previewer flag': ['--previewer', 'previewer'],
						'uploader flag': ['--uploader', 'uploader'],
						'previewer-uploader flag': [
							'--previewer-uploader',
							'previewer uploader',
						],
						'viewer-uploader flag': [
							'--viewer-uploader',
							'viewer uploader',
						],
						'co-owner flag': ['--co-owner', 'co-owner'],
						'owner flag': ['--owner', 'owner'],
						'role flag set to editor': ['--role=editor', 'editor'],
						'role flag set to co-owner': [
							'--role=co-owner',
							'co-owner',
						],
						'role flag set to viewer uploader': [
							'--role=viewer_uploader',
							'viewer uploader',
						],
					},
					function (roleFlag, roleValue) {
						test.nock(TEST_API_ROOT, (api) =>
							api
								.put(`/2.0/collaborations/${collaborationId}`, {
									...collaborationBody,
									role: roleValue,
								})
								.reply(200, fixture)
						)
							.stdout()
							.command([
								command,
								collaborationId,
								roleFlag,
								'--status=accepted',
								'--token=test',
							])
							.it(
								'should create a collaboration with the correct role when passed flag for role',
								(context) => {
									assert.equal(context.stdout, yamlOutput);
								}
							);
					}
				);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(
							`/2.0/collaborations/${collaborationId}`,
							collaborationBody
						)
						.query({ fields: 'status,role' })
						.reply(200, fixture)
				)
					.stdout()
					.command([
						command,
						collaborationId,
						'--viewer',
						'--fields=status,role',
						'--status=accepted',
						'--token=test',
					])
					.it(
						'should send fields param and filter output when --fields flag is passed',
						(context) => {
							let lb = '\n';
							assert.equal(
								context.stdout,
								`Type: collaboration${lb}ID: '1234567890'${lb}Status: accepted${lb}Role: viewer${os.EOL}`
							);
						}
					);

				leche.withData(
					{
						'can-view-path flag': ['--can-view-path', true],
						'no-can-view-path flag': ['--no-can-view-path', false],
					},
					function (viewPathFlag, canViewPathValue) {
						test.nock(TEST_API_ROOT, (api) =>
							api
								.put(`/2.0/collaborations/${collaborationId}`, {
									...collaborationBody,
									can_view_path: canViewPathValue,
								})
								.reply(200, fixture)
						)
							.stdout()
							.command([
								command,
								collaborationId,
								'--viewer',
								viewPathFlag,
								'--status=accepted',
								'--token=test',
							])
							.it(
								'should send can_view_path value when --can-view-path flag is passed',
								(context) => {
									assert.equal(context.stdout, yamlOutput);
								}
							);
					}
				);

				let expiresAt = '2020-01-01T08:00:00+00:00';

				test.nock(TEST_API_ROOT, (api) =>
					api
						.put(`/2.0/collaborations/${collaborationId}`, {
							role: 'viewer',
							expires_at: expiresAt,
						})
						.reply(200, fixture)
				)
					.stdout()
					.command([
						command,
						collaborationId,
						'--viewer',
						`--expires-at=${expiresAt}`,
						'--json',
						'--token=test',
					])
					.it(
						'should send expires_at value when --expires-at flag is passed',
						(context) => {
							assert.equal(context.stdout, fixture);
						}
					);
			});
		}
	);

	leche.withData(
		[
			'collaborations:delete',
			'files:collaborations:delete',
			'folders:collaborations:delete',
		],
		function (command) {

			describe(command, function () {
				let collaborationId = '1234567890';

				test.nock(TEST_API_ROOT, (api) =>
					api
						.delete(`/2.0/collaborations/${collaborationId}`)
						.reply(204)
				)
					.stderr()
					.command([command, collaborationId, '--token=test'])
					.it('should remove a collaboration', (context) => {
						assert.equal(
							context.stderr,
							`Collaboration ${collaborationId} successfully removed${os.EOL}`
						);
					});
			});
		}
	);

	leche.withData(
		['collaborations:create', 'collaborations:add'],
		function (command) {

			describe(command, function () {
				let itemId = '1234567890',
					boxItemType = 'folder',
					collaborationId = '1234567890',
					userID = '12345',
					groupID = '54321',
					addCollaborationFixture = getFixture(
						'collaborations/post_collaborations_user'
					),
					yamlOutput = getFixture(
						'output/collaborations_add_login_yaml.txt'
					);

				let addCollaborationBody = {
					item: {
						type: 'folder',
						id: itemId,
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
						.reply(201, addCollaborationFixture)
				)
					.stdout()
					.command([
						command,
						itemId,
						boxItemType,
						'--previewer',
						'--login=newfriend@example.com',
						'--json',
						'--token=test',
					])
					.it(
						'should output JSON when the --json flag is passed',
						(context) => {
							assert.equal(
								context.stdout,
								addCollaborationFixture
							);
						}
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.post('/2.0/collaborations', addCollaborationBody)
						.reply(201, addCollaborationFixture)
				)
					.stdout()
					.command([
						command,
						itemId,
						boxItemType,
						'--previewer',
						'--login=newfriend@example.com',
						'--token=test',
					])
					.it(
						'should create a collaboration for a Box item with the viewer and login flags passed',
						(context) => {
							assert.equal(context.stdout, yamlOutput);
						}
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.post('/2.0/collaborations', addCollaborationBody)
						.reply(201, addCollaborationFixture)
				)
					.stdout()
					.command([
						command,
						itemId,
						boxItemType,
						'--previewer',
						'--login=newfriend@example.com',
						'--id-only',
						'--token=test',
					])
					.it(
						'should output only the ID of the created collaboration when the --id-only flag is passed',
						(context) => {
							assert.equal(
								context.stdout,
								`${collaborationId}${os.EOL}`
							);
						}
					);

				leche.withData(
					{
						'editor flag': ['--editor', 'editor'],
						'viewer flag': ['--viewer', 'viewer'],
						'uploader flag': ['--uploader', 'uploader'],
						'previewer-uploader flag': [
							'--previewer-uploader',
							'previewer uploader',
						],
						'viewer-uploader flag': [
							'--viewer-uploader',
							'viewer uploader',
						],
						'co-owner flag': ['--co-owner', 'co-owner'],
						'role flag set to editor': ['--role=editor', 'editor'],
						'role flag set to co-owner': [
							'--role=co-owner',
							'co-owner',
						],
						'role flag set to viewer uploader': [
							'--role=viewer_uploader',
							'viewer uploader',
						],
					},
					function (roleFlag, roleValue) {
						test.nock(TEST_API_ROOT, (api) =>
							api
								.post('/2.0/collaborations', {
									...addCollaborationBody,
									role: roleValue,
								})
								.reply(201, addCollaborationFixture)
						)
							.stdout()
							.command([
								command,
								itemId,
								boxItemType,
								roleFlag,
								'--login=newfriend@example.com',
								'--token=test',
							])
							.it(
								'should create a collaboration with the correct role when passed flag for role',
								(context) => {
									assert.equal(context.stdout, yamlOutput);
								}
							);
					}
				);

				leche.withData(
					{
						'notify flag': ['--notify', true],
						'no-notify flag': ['--no-notify', false],
					},
					function (notifyFlag, notifyValue) {
						test.nock(TEST_API_ROOT, (api) =>
							api
								.post(
									'/2.0/collaborations',
									addCollaborationBody
								)
								.query({ notify: notifyValue })
								.reply(201, addCollaborationFixture)
						)
							.stdout()
							.command([
								command,
								itemId,
								boxItemType,
								'--previewer',
								notifyFlag,
								'--login=newfriend@example.com',
								'--token=test',
							])
							.it(
								'should send notify query param when --notify flag is passed',
								(context) => {
									assert.equal(context.stdout, yamlOutput);
								}
							);
					}
				);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.post('/2.0/collaborations', addCollaborationBody)
						.query({ fields: 'status,role' })
						.reply(201, addCollaborationFixture)
				)
					.stdout()
					.command([
						command,
						itemId,
						boxItemType,
						'--previewer',
						'--fields=status,role',
						'--login=newfriend@example.com',
						'--token=test',
					])
					.it(
						'should send fields param and filter output when --fields flag is passed',
						(context) => {
							let lb = '\n';
							assert.equal(
								context.stdout,
								`Type: collaboration${lb}ID: '1234567890'${lb}Status: accepted${lb}Role: previewer${os.EOL}`
							);
						}
					);

				leche.withData(
					{
						'can-view-path flag': ['--can-view-path', true],
						'no-can-view-path flag': ['--no-can-view-path', false],
					},
					function (viewPathFlag, canViewPathValue) {
						test.nock(TEST_API_ROOT, (api) =>
							api
								.post('/2.0/collaborations', {
									...addCollaborationBody,
									can_view_path: canViewPathValue,
								})
								.reply(201, addCollaborationFixture)
						)
							.stdout()
							.command([
								command,
								itemId,
								boxItemType,
								'--previewer',
								viewPathFlag,
								'--login=newfriend@example.com',
								'--token=test',
							])
							.it(
								'should send notify query param when --notify flag is passed',
								(context) => {
									assert.equal(context.stdout, yamlOutput);
								}
							);
					}
				);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.post('/2.0/collaborations', {
							...addCollaborationBody,
							accessible_by: {
								type: 'user',
								id: userID,
							},
						})
						.reply(201, addCollaborationFixture)
				)
					.stdout()
					.command([
						command,
						itemId,
						boxItemType,
						'--previewer',
						`--user-id=${userID}`,
						'--token=test',
					])
					.it(
						'should create collaboration for user by ID when --user-id flag is passed',
						(context) => {
							assert.equal(context.stdout, yamlOutput);
						}
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.post('/2.0/collaborations', {
							...addCollaborationBody,
							accessible_by: {
								type: 'group',
								id: groupID,
							},
						})
						.reply(201, addCollaborationFixture)
				)
					.stdout()
					.command([
						command,
						itemId,
						boxItemType,
						'--previewer',
						`--group-id=${groupID}`,
						'--token=test',
					])
					.it(
						'should create collaboration for user by ID when --user-id flag is passed',
						(context) => {
							assert.equal(context.stdout, yamlOutput);
						}
					);
			});
		}
	);

	leche.withData(
		['collaborations:get-pending', 'collaborations:pending'],
		function (command) {

			describe(command, function () {
				let fixture = getFixture(
						'collaborations/get_collaborations_pending_page_1'
					),
					fixture2 = getFixture(
						'collaborations/get_collaborations_pending_page_2'
					),
					jsonOutput = getFixture(
						'output/collaborations_get_pending_json.txt'
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.get('/2.0/collaborations')
						.query({
							status: 'pending',
							limit: 1000,
						})
						.reply(200, fixture)
						.get('/2.0/collaborations')
						.query({
							status: 'pending',
							offset: 1,
							limit: 1000,
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([command, '--json', '--token=test'])
					.it(
						'should list all pending collaborations for a user (JSON Output)',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
			});
		}
	);
});
