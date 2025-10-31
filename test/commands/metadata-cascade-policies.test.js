'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Metadata Cascade Policies', () => {
	describe('metadata-cascade-policies:get', () => {
		let cascadePolicyID = '84113349-794d-445c-b93c-d8481b223434',
			fixture = getFixture(
				'metadata-cascade-policies/get_metadata_cascade_policies_id_200'
			),
			yamlOutput = getFixture(
				'output/metadata_cascade_policies_get_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/metadata_cascade_policies/${cascadePolicyID}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-cascade-policies:get',
				cascadePolicyID,
				'--json',
				'--token=test',
			])
			.it('should get metadata cascade policy (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/metadata_cascade_policies/${cascadePolicyID}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-cascade-policies:get',
				cascadePolicyID,
				'--token=test',
			])
			.it('should get metadata cascade policy (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('metadata-cascade-policies:delete', () => {
		let cascadePolicyID = '84113349-794d-445c-b93c-d8481b223434';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/metadata_cascade_policies/${cascadePolicyID}`)
				.reply(204)
		)
			.stdout()
			.stderr()
			.command([
				'metadata-cascade-policies:delete',
				cascadePolicyID,
				'--no-color',
				'--token=test',
			])
			.it('should delete the cascade policy', (ctx) => {
				assert.equal(ctx.stdout, '');
				assert.equal(
					ctx.stderr,
					`Successfully deleted policy ${cascadePolicyID}${os.EOL}`
				);
			});
	});

	describe('metadata-cascade-policies', () => {
		let folderID = '22222',
			enterpriseID = '11111',
			fixture = getFixture(
				'metadata-cascade-policies/get_metadata_cascade_policies_folder_id_200'
			),
			jsonOutput = getFixture(
				'output/metadata_cascade_policies_list_json.txt'
			),
			tableOutput = getFixture(
				'output/metadata_cascade_policies_list_table.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/metadata_cascade_policies')
				.query({ folder_id: folderID, limit: 1000 })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-cascade-policies',
				folderID,
				'--json',
				'--token=test',
			])
			.it(
				'should output cascade policies for folder (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/metadata_cascade_policies')
				.query({ folder_id: folderID, limit: 1000 })
				.reply(200, fixture)
		)
			.stdout()
			.command(['metadata-cascade-policies', folderID, '--token=test'])
			.it(
				'should output cascade policies for folder (Table Output)',
				(ctx) => {
					assert.equal(ctx.stdout, tableOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/metadata_cascade_policies')
				.query({
					folder_id: folderID,
					owner_enterprise_id: enterpriseID,
					limit: 1000,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-cascade-policies',
				folderID,
				`--owner-enterprise-id=${enterpriseID}`,
				'--json',
				'--token=test',
			])
			.it(
				'should output only cascade policies for enterprise when --owner-enterprise-id flag is passed',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);
	});

	describe('metadata-cascade-policies:force-apply', () => {
		let cascadePolicyID = '84113349-794d-445c-b93c-d8481b223434',
			resolution = 'overwrite';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					`/2.0/metadata_cascade_policies/${cascadePolicyID}/apply`,
					{
						conflict_resolution: resolution,
					}
				)
				.reply(202)
		)
			.stdout()
			.stderr()
			.command([
				'metadata-cascade-policies:force-apply',
				cascadePolicyID,
				`--conflict-resolution=${resolution}`,
				'--no-color',
				'--token=test',
			])
			.it('should force apply the cascade policy', (ctx) => {
				assert.equal(ctx.stdout, '');
				assert.equal(
					ctx.stderr,
					`Successfully applied policy ${cascadePolicyID}${os.EOL}`
				);
			});
	});
});
