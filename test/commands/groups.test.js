'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');
const leche = require('leche');

describe('Groups', () => {

	describe('groups:get', () => {
		let groupId = '11111',
			fixture = getFixture('groups/get_groups_id'),
			yamlOutput = getFixture('output/groups_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/groups/${groupId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'groups:get',
				groupId,
				'--json',
				'--token=test'
			])
			.it('should get information about a group (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/groups/${groupId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'groups:get',
				groupId,
				'--token=test'
			])
			.it('should get information about a group (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/groups/${groupId}`)
				.query({fields: 'id,name'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'groups:get',
				groupId,
				'--fields=id,name',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	leche.withData([
		'groups',
		'groups:list'
	], function(command) {

		describe(command, () => {
			let fixture = getFixture('groups/get_groups_page_1'),
				fixture2 = getFixture('groups/get_groups_page_2'),
				jsonOutput = getFixture('output/groups_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/groups')
					.reply(200, fixture)
					.get('/2.0/groups')
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
				.it('should list all groups (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/groups')
					.query({fields: 'id,name'})
					.reply(200, fixture)
					.get('/2.0/groups')
					.query({
						fields: 'id,name',
						offset: 2
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					'--fields=id,name',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'groups:list-collaborations',
		'groups:collaborations',
		'collaborations:list-for-group'
	], function(command) {

		describe(command, () => {
			let groupId = '119720',
				fixture = getFixture('groups/get_groups_id_collaborations_page_1'),
				fixture2 = getFixture('groups/get_groups_id_collaborations_page_2'),
				jsonOutput = getFixture('output/groups_list_collaborations_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/groups/${groupId}/collaborations`)
					.reply(200, fixture)
					.get(`/2.0/groups/${groupId}/collaborations`)
					.query({
						offset: 1
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					groupId,
					'--json',
					'--token=test'
				])
				.it('should list collaborations for a group (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/groups/${groupId}/collaborations`)
					.query({fields: 'item'})
					.reply(200, fixture)
					.get(`/2.0/groups/${groupId}/collaborations`)
					.query({
						fields: 'item',
						offset: 1
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					groupId,
					'--fields=item',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	describe('groups:delete', () => {
		let groupId = '11111';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/groups/${groupId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'groups:delete',
				groupId,
				'--token=test'
			])
			.it('should delete a group', ctx => {
				assert.equal(ctx.stderr, `Deleted group ${groupId}${os.EOL}`);
			});
	});

	describe('groups:update', () => {
		let groupId = '11111',
			name = 'Remote Employees',
			members = 'all_managed_users',
			description = 'All employees not at HQ',
			provenance = 'Somewhere',
			externalSyncIdentifier = 'some',
			fixture = getFixture('groups/put_groups_id'),
			yamlOutput = getFixture('output/groups_update_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/groups/${groupId}`, { name })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'groups:update',
				groupId,
				`--name=${name}`,
				'--json',
				'--token=test'
			])
			.it('should update a group with name, invite and view-member flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/groups/${groupId}`, { name })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'groups:update',
				groupId,
				`--name=${name}`,
				'--token=test'
			])
			.it('should update a group with name, invite and view-member flags passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/groups/${groupId}`, {
					description,
					invitability_level: members,
					member_viewability_level: members,
					provenance,
					external_sync_identifier: externalSyncIdentifier,
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'groups:update',
				groupId,
				`--description=${description}`,
				`--invite=${members}`,
				`--provenance=${provenance}`,
				`--external-sync-identifier=${externalSyncIdentifier}`,
				`--view-members=${members}`,
				'--json',
				'--token=test'
			])
			.it('should send optional params when flags are passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('groups:create', () => {
		let name = 'Employees',
			members = 'all_managed_users',
			provenance = 'Elsewhere',
			description = 'Everyone',
			externalSyncIdentifier = 'else',
			fixture = getFixture('groups/post_groups'),
			yamlOutput = getFixture('output/groups_create_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/groups', { name })
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'groups:create',
				name,
				'--json',
				'--token=test'
			])
			.it('should create a group (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/groups', { name })
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'groups:create',
				name,
				'--token=test'
			])
			.it('should create a group (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/groups', { name })
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'groups:create',
				name,
				'--id-only',
				'--token=test'
			])
			.it('should output only the ID of the new group when --id-only flag is passed', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(fixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/groups', {
					name,
					description,
					invitability_level: members,
					member_viewability_level: members,
					provenance,
					external_sync_identifier: externalSyncIdentifier,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'groups:create',
				name,
				`--description=${description}`,
				`--invite=${members}`,
				`--provenance=${provenance}`,
				`--external-sync-identifier=${externalSyncIdentifier}`,
				`--view-members=${members}`,
				'--json',
				'--token=test'
			])
			.it('should send optional params when flags are passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	leche.withData([
		'groups:memberships:get',
		'groups:membership:get'
	], function(command) {

		describe(command, () => {
			let membershipId = '12345',
				fixture = getFixture('groups/get_group_memberships_id'),
				yamlOutput = getFixture('output/groups_membership_get_yaml.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/group_memberships/${membershipId}`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					membershipId,
					'--json',
					'--token=test'
				])
				.it('should get information about a group membership (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/group_memberships/${membershipId}`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					membershipId,
					'--token=test'
				])
				.it('should get information about a group membership (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/group_memberships/${membershipId}`)
					.query({fields: 'id'})
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					membershipId,
					'--fields=id',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'groups:memberships',
		'groups:membership:list'
	], function(command) {

		describe(command, () => {
			let groupId = '11111',
				fixture = getFixture('groups/get_groups_id_memberships_page_1'),
				fixture2 = getFixture('groups/get_groups_id_memberships_page_2'),
				jsonOutput = getFixture('output/groups_membership_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/groups/${groupId}/memberships`)
					.reply(200, fixture)
					.get(`/2.0/groups/${groupId}/memberships`)
					.query({
						offset: 1
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					groupId,
					'--json',
					'--token=test'
				])
				.it('should list members of a group (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/groups/${groupId}/memberships`)
					.query({fields: 'user'})
					.reply(200, fixture)
					.get(`/2.0/groups/${groupId}/memberships`)
					.query({
						fields: 'user',
						offset: 1
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					groupId,
					'--fields=user',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'groups:memberships:add',
		'groups:membership:add'
	], function(command) {

		describe(command, () => {
			let groupId = '11111',
				userId = '44444',
				fixture = getFixture('groups/post_group_memberships'),
				yamlOutput = getFixture('output/groups_membership_add_yaml.txt');

			let expectedBody = {
				role: 'member',
				group: {
					id: groupId
				},
				user: {
					id: userId
				},
				configurable_permissions: {}
			};

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/group_memberships', expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					groupId,
					'--set-member',
					'--json',
					'--token=test'
				])
				.it('should add a user to a group with the set-member flag passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/group_memberships', expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					groupId,
					'--set-member',
					'--token=test'
				])
				.it('should add a user to a group with the set-member flag passed (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/group_memberships', {
						...expectedBody,
						role: 'admin',
						configurable_permissions: {
							can_run_reports: true,
							can_instant_login: true,
							can_create_accounts: true,
							can_edit_accounts: true,
						}
					})
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					groupId,
					'--set-admin',
					'--can-run-reports',
					'--can-instant-login',
					'--can-create-accounts',
					'--can-edit-accounts',
					'--json',
					'--token=test'
				])
				.it('should send optional permissions params when the permission flags are passed', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			leche.withData({
				'set admin flag': [
					'--set-admin',
					{role: 'admin'}
				],
				'role flag set to admin': [
					'--role=admin',
					{role: 'admin'}
				],
				'role flag set to member': [
					'--role=member',
					{role: 'member'}
				]
			}, function(flag, params) {

				test
					.nock(TEST_API_ROOT, api => api
						.post('/2.0/group_memberships', {
							...expectedBody,
							...params,
						})
						.reply(201, fixture)
					)
					.stdout()
					.command([
						command,
						userId,
						groupId,
						flag,
						'--json',
						'--token=test'
					])
					.it('should send correct role value when flag is passed', ctx => {
						assert.equal(ctx.stdout, fixture);
					});
			});
		});
	});

	leche.withData([
		'groups:memberships:update',
		'groups:membership:update'
	], function(command) {

		describe(command, () => {
			let membershipId = '12345',
				fixture = getFixture('groups/get_group_memberships_id'),
				yamlOutput = getFixture('output/groups_membership_update_yaml.txt');

			let expectedBody = {
				role: 'member',
				configurable_permissions: {}
			};

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/group_memberships/${membershipId}`, expectedBody)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					membershipId,
					'--set-member',
					'--json',
					'--token=test'
				])
				.it('should update a user\'s membership to a group with the set-member flag passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/group_memberships/${membershipId}`, expectedBody)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					membershipId,
					'--set-member',
					'--token=test'
				])
				.it('should update a user\'s membership to a group with the set-member flag passed (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/group_memberships/${membershipId}`, {
						...expectedBody,
						role: 'admin',
						configurable_permissions: {
							can_run_reports: true,
							can_instant_login: true,
							can_create_accounts: true,
							can_edit_accounts: true,
						}
					})
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					membershipId,
					'--set-admin',
					'--can-run-reports',
					'--can-instant-login',
					'--can-create-accounts',
					'--can-edit-accounts',
					'--json',
					'--token=test'
				])
				.it('should send optional permissions params when the permission flags are passed', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			leche.withData({
				'set admin flag': [
					'--set-admin',
					{role: 'admin'}
				],
				'role flag set to admin': [
					'--role=admin',
					{role: 'admin'}
				],
				'role flag set to member': [
					'--role=member',
					{role: 'member'}
				]
			}, function(flag, params) {

				test
					.nock(TEST_API_ROOT, api => api
						.put(`/2.0/group_memberships/${membershipId}`, {
							...expectedBody,
							...params,
						})
						.reply(200, fixture)
					)
					.stdout()
					.command([
						command,
						membershipId,
						flag,
						'--json',
						'--token=test'
					])
					.it('should update a user\'s membership with correct role value when flag is passed', ctx => {
						assert.equal(ctx.stdout, fixture);
					});
			});
		});
	});

	leche.withData([
		'groups:memberships:remove',
		'groups:membership:remove'
	], function(command) {

		describe(command, () => {
			let membershipId = '12345';

			test
				.nock(TEST_API_ROOT, api => api
					.delete(`/2.0/group_memberships/${membershipId}`)
					.reply(204)
				)
				.stderr()
				.command([
					command,
					membershipId,
					'--token=test'
				])
				.it('should remove a user from a group', ctx => {
					assert.equal(ctx.stderr, `Removed membership ${membershipId}${os.EOL}`);
				});
		});
	});
});
