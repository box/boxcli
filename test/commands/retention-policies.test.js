'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const leche = require('leche');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Retention Policies', () => {
	describe('retention-policies:create', () => {
		let policyName = 'Financial Records',
			retentionLength = 365,
			dispositionAction = 'remove_retention',
			retentionType = 'modifiable',
			fixture = getFixture('retention-policies/post_retention_policies'),
			yamlOutput = getFixture(
				'output/retention_policies_create_yaml.txt'
			);

		let expectedBody = {
			policy_name: policyName,
			disposition_action: dispositionAction,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policies', {
					...expectedBody,
					policy_type: 'finite',
					retention_length: retentionLength,
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:create',
				policyName,
				`--disposition-action=${dispositionAction}`,
				`--retention-length=${retentionLength}`,
				'--json',
				'--token=test',
			])
			.it(
				'should create a new retention policy with the retention-length flag passed (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policies', {
					...expectedBody,
					policy_type: 'finite',
					retention_length: retentionLength,
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:create',
				policyName,
				`--disposition-action=${dispositionAction}`,
				`--retention-length=${retentionLength}`,
				'--token=test',
			])
			.it(
				'should create a new retention policy with the retention-length flag passed (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policies', {
					...expectedBody,
					policy_type: 'indefinite',
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:create',
				policyName,
				`--disposition-action=${dispositionAction}`,
				'--json',
				'--token=test',
			])
			.it(
				'should create an indefinite retention policy when indefinite arg is passed',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policies', {
					...expectedBody,
					policy_type: 'finite',
					retention_length: retentionLength,
					retention_type: retentionType,
					are_owners_notified: true,
					can_owner_extend_retention: true,
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:create',
				policyName,
				`--disposition-action=${dispositionAction}`,
				`--retention-length=${retentionLength}`,
				`--retention-type=${retentionType}`,
				'--notify-owners',
				'--allow-extension',
				'--json',
				'--token=test',
			])
			.it('should send optional params when flags are passed', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policies', {
					...expectedBody,
					policy_type: 'finite',
					retention_length: retentionLength,
					description: 'This is a description',
					custom_notification_recipients: [
						{
							type: 'user',
							id: '12345',
							login: 'user@box.com',
						},
						{
							type: 'user',
							id: '34567',
							login: 'user2@box.com',
						},
					],
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:create',
				policyName,
				`--disposition-action=${dispositionAction}`,
				`--retention-length=${retentionLength}`,
				'--description=This is a description',
				'--custom-notification-recipient=id=12345,login=user@box.com',
				'--custom-notification-recipient=id=34567,login=user2@box.com',
				'--json',
				'--token=test',
			])
			.it(
				'should create a new retention policy with custom description and custom notification recipients',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);
	});

	describe('retention-policies:update', () => {
		let policyId = '11111',
			name = 'Retained Financial Records',
			dispositionAction = 'permanently_delete',
			policyType = 'finite',
			retentionLength = 500,
			retentionType = 'non_modifiable',
			fixture = getFixture(
				'retention-policies/put_retention_policies_id'
			),
			yamlOutput = getFixture(
				'output/retention_policies_update_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/retention_policies/${policyId}`, {
					policy_name: name,
					status: 'retired',
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:update',
				policyId,
				`--policy-name=${name}`,
				'-r',
				'--json',
				'--token=test',
			])
			.it(
				'should update a retention policy with policy-name and retire flags passed (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/retention_policies/${policyId}`, {
					policy_name: name,
					status: 'retired',
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:update',
				policyId,
				`--policy-name=${name}`,
				'-r',
				'--token=test',
			])
			.it(
				'should update a retention policy with policy-name and retire flags passed (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/retention_policies/${policyId}`, {
					disposition_action: dispositionAction,
					policy_type: policyType,
					retention_length: retentionLength,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:update',
				policyId,
				`--disposition-action=${dispositionAction}`,
				`--policy-type=${policyType}`,
				`--retention-length=${retentionLength}`,
				'--json',
				'--token=test',
			])
			.it(
				'should update policy type, disposition, and length when appropriate flags are passed',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/retention_policies/${policyId}`, {
					retention_type: retentionType,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:update',
				policyId,
				'--non-modifiable',
				'--json',
				'--token=test',
			])
			.it(
				'should update retention type when appropriate flag is passed',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);
	});

	describe('retention-policies:get', () => {
		let policyId = '11111',
			fixture = getFixture(
				'retention-policies/get_retention_policies_id'
			),
			yamlOutput = getFixture('output/retention_policies_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/retention_policies/${policyId}`).reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:get',
				policyId,
				'--json',
				'--token=test',
			])
			.it(
				'should get information about a retention policy (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/retention_policies/${policyId}`).reply(200, fixture)
		)
			.stdout()
			.command(['retention-policies:get', policyId, '--token=test'])
			.it(
				'should get information about a retention policy (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policies/${policyId}`)
				.query({ fields: 'disposition_action' })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:get',
				policyId,
				'--fields=disposition_action',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('retention-policies', () => {
		let policyName = 'test',
			policyType = 'indefinite',
			creatorID = '12345',
			fixture = getFixture(
				'retention-policies/get_retention_policies_page_1'
			),
			fixture2 = getFixture(
				'retention-policies/get_retention_policies_page_2'
			),
			jsonOutput = getFixture('output/retention_policies_list_json.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/retention_policies')
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get('/2.0/retention_policies')
				.query({
					marker: 'ZDE345',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command(['retention-policies', '--json', '--token=test'])
			.it('should list all retention policies (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/retention_policies')
				.query({
					fields: 'policy_name',
					policy_name: policyName,
					policy_type: policyType,
					created_by_user_id: creatorID,
					limit: 1000,
				})
				.reply(200, fixture)
				.get('/2.0/retention_policies')
				.query({
					fields: 'policy_name',
					policy_name: policyName,
					policy_type: policyType,
					created_by_user_id: creatorID,
					marker: 'ZDE345',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies',
				`--policy-name=${policyName}`,
				`--policy-type=${policyType}`,
				`--created-by-user-id=${creatorID}`,
				'--fields=policy_name',
				'--json',
				'--token=test',
			])
			.it('should send optional params when flags are passed', (ctx) => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});

	describe('retention-policies:assignments:get', () => {
		let assignmentId = '12345',
			fixture = getFixture(
				'retention-policies/get_retention_policy_assignments_id'
			),
			yamlOutput = getFixture(
				'output/retention_policies_get_assignment_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policy_assignments/${assignmentId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assignments:get',
				assignmentId,
				'--json',
				'--token=test',
			])
			.it(
				'should get information about a retention policy assignment (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policy_assignments/${assignmentId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assignments:get',
				assignmentId,
				'--token=test',
			])
			.it(
				'should get information about a retention policy assignment (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policy_assignments/${assignmentId}`)
				.query({ fields: 'assigned_to' })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assignments:get',
				assignmentId,
				'--fields=assigned_to',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('retention-policies:assignments:remove', () => {
		let assignmentId = '123456';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/retention_policy_assignments/${assignmentId}`)
				.reply(204)
		)
			.stderr()
			.command([
				'retention-policies:assignments:remove',
				assignmentId,
				'--token=test',
			])
			.it('should remove a retention policy assignment', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Removed retention policy assignment ${assignmentId}${os.EOL}`
				);
			});
	});

	describe('retention-policies:assign', () => {
		let policyId = '11111',
			type = 'folder',
			folderId = '22222',
			fixture = getFixture(
				'retention-policies/post_retention_policy_assignments'
			),
			yamlOutput = getFixture(
				'output/retention_policies_assign_yaml.txt'
			);

		let expectedBody = {
			policy_id: policyId,
			assign_to: {
				type,
				id: folderId,
			},
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policy_assignments', expectedBody)
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assign',
				policyId,
				`--assign-to-type=${type}`,
				`--assign-to-id=${folderId}`,
				'--json',
				'--token=test',
			])
			.it(
				'should assign a retention policy assignment (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policy_assignments', expectedBody)
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assign',
				policyId,
				`--assign-to-type=${type}`,
				`--assign-to-id=${folderId}`,
				'--token=test',
			])
			.it(
				'should assign a retention policy assignment (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policy_assignments', {
					...expectedBody,
					assign_to: {
						id: null,
						type: 'enterprise',
					},
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assign',
				policyId,
				'--assign-to-type=enterprise',
				'--json',
				'--token=test',
			])
			.it(
				'should assign policy to the enterprise without taking an ID argument',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/retention_policy_assignments', {
					...expectedBody,
					assign_to: {
						type: 'enterprise',
						id: null,
					},
					filter_fields: [
						{
							field: 'a0f4ee4e-1dc1-4h90-a8a9-aef55fc681d4',
							value: '0c27b756-0p87-4fe0-a43a-59fb661ccc4e',
						},
					],
					start_date_field: 'upload_date',
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'retention-policies:assign',
				policyId,
				'--assign-to-type=enterprise',
				'--filter-field=a0f4ee4e-1dc1-4h90-a8a9-aef55fc681d4=0c27b756-0p87-4fe0-a43a-59fb661ccc4e',
				'--start-date-field=upload_date',
				'--json',
				'--token=test',
			])
			.it(
				'should assign policy to the enterprise with custom filter fields and start date field',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		// @TODO(2018-08-21): Add test for missing ID error scenario
	});

	describe('retention-policies:assignments', () => {
		let policyId = '11111',
			type = 'metadata_template',
			fixture = getFixture(
				'retention-policies/get_retention_policies_id_assignments_page_1'
			),
			fixture2 = getFixture(
				'retention-policies/get_retention_policies_id_assignments_page_2'
			),
			jsonOutput = getFixture(
				'output/retention_policies_list_assignments_json.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policies/${policyId}/assignments`)
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get(`/2.0/retention_policies/${policyId}/assignments`)
				.query({
					marker: 'ZDE456',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies:assignments',
				policyId,
				'--json',
				'--token=test',
			])
			.it(
				'should list all assignments for retention policy (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policies/${policyId}/assignments`)
				.query({ type, limit: 1000 })
				.reply(200, fixture)
				.get(`/2.0/retention_policies/${policyId}/assignments`)
				.query({
					type,
					marker: 'ZDE456',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies:assignments',
				policyId,
				`--type=${type}`,
				'--json',
				'--token=test',
			])
			.it('should send type param when --type flag is passed', (ctx) => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/retention_policies/${policyId}/assignments`)
				.query({ fields: 'assigned_to', limit: 1000 })
				.reply(200, fixture)
				.get(`/2.0/retention_policies/${policyId}/assignments`)
				.query({
					fields: 'assigned_to',
					marker: 'ZDE456',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies:assignments',
				policyId,
				'--fields=assigned_to',
				'--json',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('retention-policies:file-version-retentions:get', () => {
		let retentionId = '444444',
			fixture = getFixture(
				'retention-policies/get_file_version_retentions_id'
			),
			yamlOutput = getFixture(
				'output/retention_policies_get_version_retention_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/file_version_retentions/${retentionId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:file-version-retentions:get',
				retentionId,
				'--json',
				'--token=test',
			])
			.it(
				'should get information about a file version retention policy (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/file_version_retentions/${retentionId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:file-version-retentions:get',
				retentionId,
				'--token=test',
			])
			.it(
				'should get information about a file version retention policy (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/file_version_retentions/${retentionId}`)
				.query({ fields: 'id' })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'retention-policies:file-version-retentions:get',
				retentionId,
				'--fields=id',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('retention-policies:file-version-retentions', () => {
		let fixture = getFixture(
				'retention-policies/get_file_version_retentions_page_1'
			),
			fixture2 = getFixture(
				'retention-policies/get_file_version_retentions_page_2'
			),
			jsonOutput = getFixture(
				'output/retention_policies_list_version_retentions_json.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/file_version_retentions')
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get('/2.0/file_version_retentions')
				.query({
					marker: 'ZAD345',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies:file-version-retentions',
				'--json',
				'--token=test',
			])
			.it(
				'should list all file version retentions (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);

		leche.withData(
			{
				'disposition action flag': [
					'--disposition-action=remove_retention',
					{ disposition_action: 'remove_retention' },
				],
				'file ID flag': ['--file-id=1234', { file_id: '1234' }],
				'file version ID flag': [
					'--file-version-id=9876',
					{ file_version_id: '9876' },
				],
				'policy ID flag': ['--policy-id=4444', { policy_id: '4444' }],
				'disposition after flag': [
					'--disposition-after=2024-11-07T12:34:56+00:00',
					{ disposition_after: '2024-11-07T12:34:56+00:00' },
				],
				'disposition before flag': [
					'--disposition-before=2024-11-07T12:34:56+00:00',
					{ disposition_before: '2024-11-07T12:34:56+00:00' },
				],
				'fields flag': ['--fields=id', { fields: 'id' }],
			},
			function (flag, queryParams) {
				test.nock(TEST_API_ROOT, (api) =>
					api
						.get('/2.0/file_version_retentions')
						.query({ ...queryParams, limit: 1000 })
						.reply(200, fixture)
						.get('/2.0/file_version_retentions')
						.query({
							...queryParams,
							marker: 'ZAD345',
							limit: 1000,
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([
						'retention-policies:file-version-retentions',
						flag,
						'--json',
						'--token=test',
					])
					.it(
						'should pass optional parameter when flag is passed',
						(ctx) => {
							assert.equal(ctx.stdout, jsonOutput);
						}
					);
			}
		);
	});

	describe('retention-policies:files-under-retention:get', () => {
		let policyAssignmentId = '11111',
			fixture = getFixture(
				'retention-policies/get_files_under_retention_page_1'
			),
			fixture2 = getFixture(
				'retention-policies/get_files_under_retention_page_2'
			),
			jsonOutput = getFixture(
				'output/retention_policies_get_files_under_retention_json.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/retention_policy_assignments/${policyAssignmentId}/files_under_retention`
				)
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get(
					`/2.0/retention_policy_assignments/${policyAssignmentId}/files_under_retention`
				)
				.query({
					marker: 'ZAD345',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies:files-under-retention:get',
				policyAssignmentId,
				'--json',
				'--token=test',
			])
			.it(
				'should list all files under retention for assignment  (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);
	});

	describe('retention-policies:file-versions-under-retention:get', () => {
		let policyAssignmentId = '11111',
			fixture = getFixture(
				'retention-policies/get_file_versions_under_retention_page_1'
			),
			fixture2 = getFixture(
				'retention-policies/get_file_versions_under_retention_page_2'
			),
			jsonOutput = getFixture(
				'output/retention_policies_get_file_versions_under_retention_json.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/retention_policy_assignments/${policyAssignmentId}/file_versions_under_retention`
				)
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get(
					`/2.0/retention_policy_assignments/${policyAssignmentId}/file_versions_under_retention`
				)
				.query({
					marker: 'ZAD345',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'retention-policies:file-versions-under-retention:get',
				policyAssignmentId,
				'--json',
				'--token=test',
			])
			.it(
				'should list all file versions under retention for assignment (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);
	});
});
