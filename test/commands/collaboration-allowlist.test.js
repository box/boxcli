'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Collaboration-Allowlist', () => {
	describe('collaboration-allowlist:get', () => {
		let allowlistEntryId = '11111',
			fixture = getFixture(
				'collaboration-allowlist/get_collaboration_whitelist_entries_id'
			),
			yamlOutput = getFixture(
				'output/collaboration_whitelist_get_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/collaboration_whitelist_entries/${allowlistEntryId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:get',
				allowlistEntryId,
				'--json',
				'--token=test',
			])
			.it('should output JSON when --json flag is passed', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/collaboration_whitelist_entries/${allowlistEntryId}`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:get',
				allowlistEntryId,
				'--token=test',
			])
			.it(
				'should get a collaboration allowlist entry (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/collaboration_whitelist_entries/${allowlistEntryId}`)
				.query({ fields: 'direction' })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:get',
				allowlistEntryId,
				'--fields=direction',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('collaboration-allowlist:add', () => {
		let domain = 'test.com',
			direction = 'both',
			fixture = getFixture(
				'collaboration-allowlist/post_collaboration_whitelists'
			),
			yamlOutput = getFixture(
				'output/collaboration_whitelist_add_yaml.txt'
			);

		let expectedBody = {
			domain: 'test.com',
			direction: 'both',
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/collaboration_whitelist_entries', expectedBody)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:add',
				domain,
				`--direction=${direction}`,
				'--json',
				'--token=test',
			])
			.it(
				'should add a collaboration allowlist entry (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/collaboration_whitelist_entries', expectedBody)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:add',
				domain,
				`--direction=${direction}`,
				'--token=test',
			])
			.it(
				'should add a collaboration allowlist entry (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);
	});

	describe('collaboration-allowlist:delete', () => {
		let allowlistEntryId = '11111';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(
					`/2.0/collaboration_whitelist_entries/${allowlistEntryId}`
				)
				.reply(204)
		)
			.stderr()
			.command([
				'collaboration-allowlist:delete',
				allowlistEntryId,
				'--token=test',
			])
			.it('should delete a collaboration allowlist entry', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Deleted collaboration allowlist entry ${allowlistEntryId}${os.EOL}`
				);
			});
	});

	describe('collaboration-allowlist', () => {
		let fixture = getFixture(
				'collaboration-allowlist/get_collaboration_whitelist_entries_page_1'
			),
			fixture2 = getFixture(
				'collaboration-allowlist/get_collaboration_whitelist_entries_page_2'
			),
			jsonOutput = getFixture(
				'output/collaboration_whitelist_list_json.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/collaboration_whitelist_entries')
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_entries')
				.query({
					marker: 'ZEDFO9',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command(['collaboration-allowlist', '--json', '--token=test'])
			.it(
				'should list collaboration allowlist entries (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/collaboration_whitelist_entries')
				.query({ fields: 'direction', limit: 1000 })
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_entries')
				.query({
					fields: 'direction',
					marker: 'ZEDFO9',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'collaboration-allowlist',
				'--fields=direction',
				'--json',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('collaboration-allowlist:exemptions:get', () => {
		let exemptionId = '11111',
			fixture = getFixture(
				'collaboration-allowlist/get_collaboration_whitelist_exempt_targets_id'
			),
			yamlOutput = getFixture(
				'output/collaboration_whitelist_get_exemption_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions:get',
				exemptionId,
				'--json',
				'--token=test',
			])
			.it(
				'should get a collaboration allowlist exemption (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions:get',
				exemptionId,
				'--token=test',
			])
			.it(
				'should get a collaboration allowlist exemption (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(
					`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`
				)
				.query({ fields: 'id' })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions:get',
				exemptionId,
				'--fields=id',
				'--token=test',
			])
			.it(
				'should send the fields param to the API when --fields flag is passed'
			);
	});

	describe('collaboration-allowlist:exemptions:create', () => {
		let userId = '5678',
			fixture = getFixture(
				'collaboration-allowlist/post_collaboration_exempt_targets'
			),
			yamlOutput = getFixture(
				'output/collaboration_whitelist_create_exemption_yaml.txt'
			);

		let expectedBody = {
			user: {
				id: userId,
				type: 'user',
			},
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					'/2.0/collaboration_whitelist_exempt_targets',
					expectedBody
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions:create',
				userId,
				'--json',
				'--token=test',
			])
			.it(
				'should create a collaboration allowlist exemption (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					'/2.0/collaboration_whitelist_exempt_targets',
					expectedBody
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions:create',
				userId,
				'--token=test',
			])
			.it(
				'should create a collaboration allowlist exemption (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);
	});

	describe('collaboration-allowlist:exemptions', () => {
		let fixture = getFixture(
				'collaboration-allowlist/get_collaboration_whitelist_exempt_targets_page_1'
			),
			fixture2 = getFixture(
				'collaboration-allowlist/get_collaboration_whitelist_exempt_targets_page_2'
			),
			jsonOutput = getFixture(
				'output/collaboration_whitelist_list_exemptions_json.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({ limit: 1000 })
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({
					marker: 'ZDEH786',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions',
				'--json',
				'--token=test',
			])
			.it(
				'should list collaboration allowlist exemptions (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({ fields: 'id', limit: 1000 })
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({
					fields: 'id',
					marker: 'ZDEH786',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'collaboration-allowlist:exemptions',
				'--fields=id',
				'--json',
				'--token=test',
			])
			.it(
				'should send fields param to the API when --fields flag is passed'
			);
	});

	describe('collaboration-allowlist:exemptions:delete', () => {
		let exemptionId = '11111';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(
					`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`
				)
				.reply(204)
		)
			.stderr()
			.command([
				'collaboration-allowlist:exemptions:delete',
				exemptionId,
				'--token=test',
			])
			.it('should delete collaboration allowlist exemption', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Deleted collaboration allowlist exemption ${exemptionId}${os.EOL}`
				);
			});
	});
});
