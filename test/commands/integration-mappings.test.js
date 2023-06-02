'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Integration Mappings', () => {
	describe('integration-mappings:slack:list', () => {
		let partnerItemId = '1234',
			fixture = getFixture('integration-mappings/get_integration_mappings_slack_page_1'),
			fixture2 = getFixture('integration-mappings/get_integration_mappings_slack_page_2'),
			jsonOutput = getFixture('output/integration_mappings_slack_get_json.txt');

		test
			.nock(TEST_API_ROOT, api =>
				api
					.get('/2.0/integration_mappings/slack')
					.query({partner_item_id: partnerItemId, is_manually_created: true, limit: 1000 })
					.reply(200, fixture)
					.get('/2.0/integration_mappings/slack')
					.query({partner_item_id: partnerItemId, is_manually_created: true, limit: 1000, marker: 'ZDFARAFD' })
					.reply(200, fixture2)
			)
			.stdout()
			.command([
				'integration-mappings:slack:list',
				`--partner-item-id=${partnerItemId}`,
				'--manually-created',
				'--json',
				'--token=test'
			])
			.it('should list Slack integration mappings', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});

	describe('integration-mappings:slack:create', () => {
		let boxItemId = '23456',
			channelId = 'C12378991223',
			slackOrgId = 'E1234567',
			fixture = getFixture('integration-mappings/post_integration_mappings_slack');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/integration_mappings/slack', {
					box_item: {
						id: boxItemId,
						type: 'folder'
					},
					partner_item: {
						type: 'channel',
						id: channelId,
						slack_org_id: slackOrgId
					},
					options: {
						is_access_management_disabled: true,
					}
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'integration-mappings:slack:create',
				boxItemId,
				channelId,
				`--slack-org-id=${slackOrgId}`,
				'--disable-access-management',
				'--json',
				'--token=test',
			])
			.it('should create a Slack integration mapping', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('integration-mappings:slack:update', () => {
		let integrationMappingId = '12345',
		boxItemId = '7890',
		fixture = getFixture('integration-mappings/put_integration_mappings_slack_id');

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/integration_mappings/slack/${integrationMappingId}`, {
					box_item: {
						id: boxItemId,
						type: 'folder'
					},
					options: {
						is_access_management_disabled: false,
					}
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'integration-mappings:slack:update',
				integrationMappingId,
				`--box-item-id=${boxItemId}`,
				'--no-disable-access-management',
				'--json',
				'--token=test',
			])
			.it('should update a Slack integration mapping', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('integration-mappings:slack:delete', () => {
		let integrationMappingId = '12345';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/integration_mappings/slack/${integrationMappingId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'integration-mappings:slack:delete',
				integrationMappingId,
				'--token=test'
			])
			.it('should delete a Slack integration mapping', ctx => {
				assert.equal(ctx.stderr, `Deleted Slack integration mapping ${integrationMappingId}${os.EOL}`);
			});
	});
});
