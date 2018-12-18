'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Legal Hold Policies', () => {

	describe('legal-hold-policies:get', () => {
		let policyId = '11111',
			fixture = getFixture('legal-hold-policies/get_legal_hold_policies_id'),
			yamlOutput = getFixture('output/legal_hold_policies_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/legal_hold_policies/${policyId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:get',
				policyId,
				'--json',
				'--token=test'
			])
			.it('should get information about a legal hold policy (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/legal_hold_policies/${policyId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:get',
				policyId,
				'--token=test'
			])
			.it('should get information about a legal hold policy (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/legal_hold_policies/${policyId}`)
				.query({fields: 'id'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:get',
				policyId,
				'--fields=id',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('legal-hold-policies:create', () => {
		let name = 'Trial Documents',
			description = 'Documents for the litigation proceedings',
			startDate = '2011-08-14T05:11:00-00:00',
			endDate = '2014-08-14T05:11:00-00:00',
			fixture = getFixture('legal-hold-policies/post_legal_hold_policies'),
			yamlOutput = getFixture('output/legal_hold_policies_create_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/legal_hold_policies', {
					policy_name: name,
					is_ongoing: true,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:create',
				name,
				'--ongoing',
				'--json',
				'--token=test'
			])
			.it('should create a new legal hold policy with the is-ongoing flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/legal_hold_policies', {
					policy_name: name,
					is_ongoing: true,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:create',
				name,
				'--ongoing',
				'--token=test'
			])
			.it('should create a new legal hold policy with the is-ongoing flag passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/legal_hold_policies', {
					policy_name: name,
					description,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:create',
				name,
				`--description=${description}`,
				'--json',
				'--token=test'
			])
			.it('should send the description param when the --description flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/legal_hold_policies', {
					policy_name: name,
					filter_started_at: startDate,
					filter_ended_at: endDate,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:create',
				name,
				`--filter-started-at=${startDate}`,
				`--filter-ended-at=${endDate}`,
				'--json',
				'--token=test'
			])
			.it('should send the filter start and end dates when the --filter-*-at flags are passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('legal-hold-polices:update', () => {
		let policyId = '11111',
			description = 'Documents related to our ongoing litigation',
			name = '[DONE] Trial documents',
			releaseNotes = 'The trial concluded with favorable results',
			fixture = getFixture('legal-hold-policies/put_legal_hold_policies_id'),
			yamlOutput = getFixture('output/legal_hold_policies_update_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/legal_hold_policies/${policyId}`, { description })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:update',
				policyId,
				`--description=${description}`,
				'--json',
				'--token=test'
			])
			.it('should update a legal hold policy with the description flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/legal_hold_policies/${policyId}`, { description })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:update',
				policyId,
				`--description=${description}`,
				'--token=test'
			])
			.it('should update a legal hold policy with the description flag passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/legal_hold_policies/${policyId}`, {
					policy_name: name,
					release_notes: releaseNotes,
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:update',
				policyId,
				`--policy-name=${name}`,
				`--release-notes=${releaseNotes}`,
				'--json',
				'--token=test'
			])
			.it('should update a legal hold policy with the --policy-name and --release-notes flags passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('legal-hold-policies:delete', () => {
		let policyId = '11111';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/legal_hold_policies/${policyId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'legal-hold-policies:delete',
				policyId,
				'--token=test'
			])
			.it('should delete a legal hold policy', ctx => {
				assert.equal(ctx.stderr, `Deleted legal hold policy ${policyId}${os.EOL}`);
			});
	});

	describe('legal-hold-policies', () => {
		let fixture = getFixture('legal-hold-policies/get_legal_hold_policies'),
			policyNameFilter = 'Trial',
			jsonOutput = getFixture('output/legal_hold_policies_list_json.txt'),
			tableOutput = getFixture('output/legal_hold_policies_list_table.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policies')
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies',
				'--json',
				'--token=test'
			])
			.it('should list legal hold policies (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policies')
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies',
				'--token=test'
			])
			.it('should list legal hold policies (YAML Output)', ctx => {
				assert.equal(ctx.stdout, tableOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policies')
				.query({ policy_name: policyNameFilter })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies',
				`--policy-name=${policyNameFilter}`,
				'--json',
				'--token=test'
			])
			.it('should send policy name filter when --policy-name flag is passed', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policies')
				.query({fields: 'id'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies',
				'--fields=id',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('legal-hold-policies:assignments', () => {
		let policyId = '11111',
			assignToType = 'file',
			assignToID = '99',
			fixture = getFixture('legal-hold-policies/get_legal_hold_policy_assignments_policy_id_page_1'),
			fixture2 = getFixture('legal-hold-policies/get_legal_hold_policy_assignments_policy_id_page_2'),
			jsonOutput = getFixture('output/legal_hold_policies_list_assignments_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policy_assignments')
				.query({
					policy_id: policyId
				})
				.reply(200, fixture)
				.get('/2.0/legal_hold_policy_assignments')
				.query({
					policy_id: policyId,
					marker: 'ZDCE3'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'legal-hold-policies:assignments',
				policyId,
				'--json',
				'--token=test'
			])
			.it('should list policy assignments (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policy_assignments')
				.query({
					policy_id: policyId,
					assign_to_type: assignToType,
					assign_to_id: assignToID,
				})
				.reply(200, fixture)
				.get('/2.0/legal_hold_policy_assignments')
				.query({
					policy_id: policyId,
					assign_to_type: assignToType,
					assign_to_id: assignToID,
					marker: 'ZDCE3'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'legal-hold-policies:assignments',
				policyId,
				`--assign-to-type=${assignToType}`,
				`--assign-to-id=${assignToID}`,
				'--json',
				'--token=test'
			])
			.it('should send assignment filter params when --assign-to-* flags are passed', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/legal_hold_policy_assignments')
				.query({
					fields: 'id',
					policy_id: policyId
				})
				.reply(200, fixture)
				.get('/2.0/legal_hold_policy_assignments')
				.query({
					fields: 'id',
					policy_id: policyId,
					marker: 'ZDCE3'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'legal-hold-policies:assignments',
				policyId,
				'--fields=id',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('legal-hold-policies:assignments:get', () => {

		let assignmentId = '12345',
			fixture = getFixture('legal-hold-policies/get_legal_hold_policy_assignments_id'),
			yamlOutput = getFixture('output/legal_hold_policies_get_assignment_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/legal_hold_policy_assignments/${assignmentId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:assignments:get',
				assignmentId,
				'--json',
				'--token=test'
			])
			.it('should get information about a policy assignment (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/legal_hold_policy_assignments/${assignmentId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:assignments:get',
				assignmentId,
				'--token=test'
			])
			.it('should get information about a policy assignment (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/legal_hold_policy_assignments/${assignmentId}`)
				.query({fields: 'id'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:assignments:get',
				assignmentId,
				'--fields=id',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('legal-hold-policies:assign', () => {
		let policyId = '11111',
			type = 'folder',
			folderId = '55555',
			fixture = getFixture('legal-hold-policies/post_legal_hold_policy_assignments'),
			yamlOutput = getFixture('output/legal_hold_policies_assign_yaml.txt');

		let expectedBody = {
			policy_id: policyId,
			assign_to: {
				type: 'folder',
				id: folderId
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/legal_hold_policy_assignments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:assign',
				policyId,
				`--assign-to-type=${type}`,
				`--assign-to-id=${folderId}`,
				'--json',
				'--token=test'
			])
			.it('should create a new policy assignment (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/legal_hold_policy_assignments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:assign',
				policyId,
				`--assign-to-type=${type}`,
				`--assign-to-id=${folderId}`,
				'--token=test'
			])
			.it('should create a new policy assignment (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('legal-hold-policies:assignments:delete', () => {
		let assignmentId = '12345';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/legal_hold_policy_assignments/${assignmentId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'legal-hold-policies:assignments:delete',
				assignmentId,
				'--token=test'
			])
			.it('should delete a policy assignment', ctx => {
				assert.equal(ctx.stderr, `Delete policy assignment ${assignmentId}${os.EOL}`);
			});
	});

	describe('legal-hold-policies:file-version-holds:get', () => {
		let holdId = '99999',
			fixture = getFixture('legal-hold-policies/get_file_version_legal_holds_id'),
			yamlOutput = getFixture('output/legal_hold_policies_get_version_hold_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/file_version_legal_holds/${holdId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:file-version-holds:get',
				holdId,
				'--json',
				'--token=test'
			])
			.it('should get information about a file version legal hold (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/file_version_legal_holds/${holdId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:file-version-holds:get',
				holdId,
				'--token=test'
			])
			.it('should get information about a file version legal hold (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/file_version_legal_holds/${holdId}`)
				.query({fields: 'id'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'legal-hold-policies:file-version-holds:get',
				holdId,
				'--fields=id',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('legal-hold-policies:file-version-holds', () => {
		let policyId = '11111',
			fixture = getFixture('legal-hold-policies/get_file_version_legal_holds_page_1'),
			fixture2 = getFixture('legal-hold-policies/get_file_version_legal_holds_page_2'),
			jsonOutput = getFixture('output/legal_hold_policies_list_version_holds_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/file_version_legal_holds')
				.query({
					policy_id: policyId
				})
				.reply(200, fixture)
				.get('/2.0/file_version_legal_holds')
				.query({
					policy_id: policyId,
					marker: 'ZDCE3'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'legal-hold-policies:file-version-holds',
				policyId,
				'--json',
				'--token=test'
			])
			.it('should list file version legal holds for a legal hold policy (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/file_version_legal_holds')
				.query({
					fields: 'id',
					policy_id: policyId
				})
				.reply(200, fixture)
				.get('/2.0/file_version_legal_holds')
				.query({
					fields: 'id',
					policy_id: policyId,
					marker: 'ZDCE3'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'legal-hold-policies:file-version-holds',
				policyId,
				'--fields=id',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});
});
