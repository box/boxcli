'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Collaboration-Whitelist', () => {

	describe('collaboration-whitelist:get', () => {
		let whitelistEntryId = '11111',
			fixture = getFixture('collaboration-whitelist/get_collaboration_whitelist_entries_id'),
			yamlOutput = getFixture('output/collaboration_whitelist_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collaboration_whitelist_entries/${whitelistEntryId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:get',
				whitelistEntryId,
				'--json',
				'--token=test'
			])
			.it('should output JSON when --json flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collaboration_whitelist_entries/${whitelistEntryId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:get',
				whitelistEntryId,
				'--token=test'
			])
			.it('should get a collaboration whitelist entry (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collaboration_whitelist_entries/${whitelistEntryId}`)
				.query({fields: 'direction'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:get',
				whitelistEntryId,
				'--fields=direction',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('collaboration-whitelist:add', () => {
		let domain = 'test.com',
			direction = 'both',
			fixture = getFixture('collaboration-whitelist/post_collaboration_whitelists'),
			yamlOutput = getFixture('output/collaboration_whitelist_add_yaml.txt');

		let expectedBody = {
			domain: 'test.com',
			direction: 'both'
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaboration_whitelist_entries', expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:add',
				domain,
				`--direction=${direction}`,
				'--json',
				'--token=test'
			])
			.it('should add a collaboration whitelist entry (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaboration_whitelist_entries', expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:add',
				domain,
				`--direction=${direction}`,
				'--token=test'
			])
			.it('should add a collaboration whitelist entry (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('collaboration-whitelist:delete', () => {
		let whitelistEntryId = '11111';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/collaboration_whitelist_entries/${whitelistEntryId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'collaboration-whitelist:delete',
				whitelistEntryId,
				'--token=test'
			])
			.it('should delete a collaboration whitelist entry', ctx => {
				assert.equal(ctx.stderr, `Deleted collaboration whitelist entry ${whitelistEntryId}${os.EOL}`);
			});
	});

	describe('collaboration-whitelist', () => {
		let fixture = getFixture('collaboration-whitelist/get_collaboration_whitelist_entries_page_1'),
			fixture2 = getFixture('collaboration-whitelist/get_collaboration_whitelist_entries_page_2'),
			jsonOutput = getFixture('output/collaboration_whitelist_list_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/collaboration_whitelist_entries')
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_entries')
				.query({
					marker: 'ZEDFO9'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'collaboration-whitelist',
				'--json',
				'--token=test'
			])
			.it('should list collaboration whitelist entries (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/collaboration_whitelist_entries')
				.query({fields: 'direction'})
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_entries')
				.query({
					fields: 'direction',
					marker: 'ZEDFO9'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'collaboration-whitelist',
				'--fields=direction',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('collaboration-whitelist:exemptions:get', () => {
		let exemptionId = '11111',
			fixture = getFixture('collaboration-whitelist/get_collaboration_whitelist_exempt_targets_id'),
			yamlOutput = getFixture('output/collaboration_whitelist_get_exemption_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions:get',
				exemptionId,
				'--json',
				'--token=test'
			])
			.it('should get a collaboration whitelist exemption (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions:get',
				exemptionId,
				'--token=test'
			])
			.it('should get a collaboration whitelist exemption (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`)
				.query({fields: 'id'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions:get',
				exemptionId,
				'--fields=id',
				'--token=test'
			])
			.it('should send the fields param to the API when --fields flag is passed');
	});

	describe('collaboration-whitelist:exemptions:create', () => {
		let userId = '5678',
			fixture = getFixture('collaboration-whitelist/post_collaboration_exempt_targets'),
			yamlOutput = getFixture('output/collaboration_whitelist_create_exemption_yaml.txt');

		let expectedBody = {
			user: {
				id: userId,
				type: 'user'
			}
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaboration_whitelist_exempt_targets', expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions:create',
				userId,
				'--json',
				'--token=test'
			])
			.it('should create a collaboration whitelist exemption (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaboration_whitelist_exempt_targets', expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions:create',
				userId,
				'--token=test'
			])
			.it('should create a collaboration whitelist exemption (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('collaboration-whitelist:exemptions', () => {
		let fixture = getFixture('collaboration-whitelist/get_collaboration_whitelist_exempt_targets_page_1'),
			fixture2 = getFixture('collaboration-whitelist/get_collaboration_whitelist_exempt_targets_page_2'),
			jsonOutput = getFixture('output/collaboration_whitelist_list_exemptions_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({
					marker: 'ZDEH786'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions',
				'--json',
				'--token=test'
			])
			.it('should list collaboration whitelist exemptions (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({fields: 'id'})
				.reply(200, fixture)
				.get('/2.0/collaboration_whitelist_exempt_targets')
				.query({
					fields: 'id',
					marker: 'ZDEH786'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'collaboration-whitelist:exemptions',
				'--fields=id',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('collaboration-whitelist:exemptions:delete', () => {
		let exemptionId = '11111';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/collaboration_whitelist_exempt_targets/${exemptionId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'collaboration-whitelist:exemptions:delete',
				exemptionId,
				'--token=test'
			])
			.it('should delete collaboration whitelist exemption', ctx => {
				assert.equal(ctx.stderr, `Deleted collaboration whitelist exemption ${exemptionId}${os.EOL}`);
			});
	});
});
