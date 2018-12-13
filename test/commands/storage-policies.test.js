'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');
const leche = require('leche');

describe('Storage-policies', () => {

	describe('storage-policies:get', () => {
		let storagePolicyId = '123',
			fixture = getFixture('storage-policies/get_storage_policies_id'),
			yamlOutput = getFixture('output/storage_policies_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/storage_policies/${storagePolicyId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'storage-policies:get',
				storagePolicyId,
				'--json',
				'--token=test'
			])
			.it('should get information on a storage policy (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/storage_policies/${storagePolicyId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'storage-policies:get',
				storagePolicyId,
				'--token=test'
			])
			.it('should get information on a storage policy (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	leche.withData([
		'storage-policies',
		'storage-policies:list'
	], function(command) {

		describe(command, () => {
			let fixture = getFixture('storage-policies/get_storage_policies_page_1'),
				fixture2 = getFixture('storage-policies/get_storage_policies_page_2'),
				jsonOutput = getFixture('output/storage_policies_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/storage_policies')
					.reply(200, fixture)
					.get('/2.0/storage_policies')
					.query({
						marker: 'ZDE789'
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					'--json',
					'--token=test'
				])
				.it('should list storage policies (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	describe('storage-policies:assignments:get', () => {
		let assignmentId = 'user_987654321',
			fixture = getFixture('storage-policies/get_storage_policy_assignments_id'),
			yamlOutput = getFixture('output/storage_policies_get_assignment_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/storage_policy_assignments/${assignmentId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'storage-policies:assignments:get',
				assignmentId,
				'--json',
				'--token=test'
			])
			.it('should get information on a storage policy assignment (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/storage_policy_assignments/${assignmentId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'storage-policies:assignments:get',
				assignmentId,
				'--token=test'
			])
			.it('should get information on a storage policy assignment (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('storage-policies:assignments:lookup', () => {
		let enterpriseId = '77777',
			type = 'enterprise',
			fixture = getFixture('storage-policies/get_storage_policy_assignments_resolved_for_enterprise'),
			yamlOutput = getFixture('output/storage_policies_lookup_assignment_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/storage_policy_assignments')
				.query({
					resolved_for_type: type,
					resolved_for_id: enterpriseId
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'storage-policies:assignments:lookup',
				`--type=${type}`,
				enterpriseId,
				'--json',
				'--token=test'
			])
			.it('should look up which storage policy an object is assigned to (JSON Output)', ctx => {
				let expectedObject = JSON.parse(fixture).entries[0];
				assert.equal(ctx.stdout, `${JSON.stringify(expectedObject, null, 4)}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/storage_policy_assignments')
				.query({
					resolved_for_type: type,
					resolved_for_id: enterpriseId
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'storage-policies:assignments:lookup',
				enterpriseId,
				`--type=${type}`,
				'--token=test'
			])
			.it('should look up which storage policy an object is assigned to (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('storage-policies:assign', () => {
		let policyId = '223',
			userId = '987654321',
			fixture = getFixture('storage-policies/post_storage_policy_assignments'),
			enterpriseAssignmentFixture = getFixture('storage-policies/get_storage_policy_assignments_resolved_for_enterprise'),
			yamlOutput = getFixture('output/storage_policies_assign_yaml.txt');

		let expectedBody = {
			storage_policy: {
				type: 'storage_policy',
				id: policyId
			},
			assigned_to: {
				type: 'user',
				id: userId
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/storage_policy_assignments')
				.query({
					resolved_for_id: userId,
					resolved_for_type: 'user',
				})
				.reply(200, enterpriseAssignmentFixture)
				.post('/2.0/storage_policy_assignments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'storage-policies:assign',
				policyId,
				userId,
				'--json',
				'--token=test'
			])
			.it('should assign a storage policy (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/storage_policy_assignments')
				.query({
					resolved_for_id: userId,
					resolved_for_type: 'user',
				})
				.reply(200, enterpriseAssignmentFixture)
				.post('/2.0/storage_policy_assignments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'storage-policies:assign',
				policyId,
				userId,
				'--token=test'
			])
			.it('should assign a storage policy (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('storage-policies:assignments:remove', () => {
		let assignmentId = 'user_987654321';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/storage_policy_assignments/${assignmentId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'storage-policies:assignments:remove',
				assignmentId,
				'--token=test'
			])
			.it('should delete storage policy assignment', ctx => {
				assert.equal(ctx.stderr, `Deleted storage policy assignment ${assignmentId}${os.EOL}`);
			});
	});
});
