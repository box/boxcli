'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Integration Mappings', () => {
	describe('integration-mappings:slack:list', () => {
		let partnerItemId = '1234',
			fixture = getFixture(
				'integration-mappings/get_integration_mappings_slack_page_1',
			),
			fixture2 = getFixture(
				'integration-mappings/get_integration_mappings_slack_page_2',
			),
			jsonOutput = getFixture('output/integration_mappings_slack_get_json.txt');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/integration_mappings/slack')
					.query({
						partner_item_id: partnerItemId,
						is_manually_created: true,
						limit: 1000,
					})
					.reply(200, fixture)
					.get('/2.0/integration_mappings/slack')
					.query({
						partner_item_id: partnerItemId,
						is_manually_created: true,
						limit: 1000,
						marker: 'ZDFARAFD',
					})
					.reply(200, fixture2),
			)
			.stdout()
			.command([
				'integration-mappings:slack:list',
				`--partner-item-id=${partnerItemId}`,
				'--manually-created',
				'--json',
				'--token=test',
			])
			.it('should list Slack integration mappings', (ctx) => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});

	describe('integration-mappings:slack:create', () => {
		let boxItemId = '23456',
			channelId = 'C12378991223',
			slackOrgId = 'E1234567',
			fixture = getFixture(
				'integration-mappings/post_integration_mappings_slack',
			);

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/2.0/integration_mappings/slack', {
						box_item: {
							id: boxItemId,
							type: 'folder',
						},
						partner_item: {
							type: 'channel',
							id: channelId,
							slack_org_id: slackOrgId,
						},
						options: {
							is_access_management_disabled: true,
						},
					})
					.reply(200, fixture),
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
			.it('should create a Slack integration mapping', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('integration-mappings:slack:update', () => {
		let integrationMappingId = '12345',
			boxItemId = '7890',
			fixture = getFixture(
				'integration-mappings/put_integration_mappings_slack_id',
			);

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/integration_mappings/slack/${integrationMappingId}`, {
						box_item: {
							id: boxItemId,
							type: 'folder',
						},
						options: {
							is_access_management_disabled: false,
						},
					})
					.reply(200, fixture),
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
			.it('should update a Slack integration mapping', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('integration-mappings:slack:delete', () => {
		let integrationMappingId = '12345';

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.delete(`/2.0/integration_mappings/slack/${integrationMappingId}`)
					.reply(204),
			)
			.stderr()
			.command([
				'integration-mappings:slack:delete',
				integrationMappingId,
				'--token=test',
			])
			.it('should delete a Slack integration mapping', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Deleted Slack integration mapping ${integrationMappingId}${os.EOL}`,
				);
			});
	});

	describe('integration-mappings:teams:list', () => {
		let partnerItemId = '1234',
			partnerItemType = 'channel',
			boxItemId = '1234',
			boxItemType = 'folder',
			fixture = getFixture(
				'integration-mappings/get_integration_mappings_teams',
			),
			expectedResult = {
				entries: [
					{
						id: '12345',
						type: 'integration_mapping',
						boxItem: {
							id: '42037322',
							type: 'folder',
						},
						createdAt: {
							value: '2012-12-12T18:53:43.000Z',
						},
						integrationType: 'teams',
						isOverriddenByManualMapping: true,
						modifiedAt: {
							value: '2012-12-12T18:53:43.000Z',
						},
						partnerItem: {
							id: '19%3ABCD-Avgfggkggyftdtfgghjhkhkhh%40thread:tacv2',
							tenantId: 'E1234567',
							type: 'channel',
						},
					},
				],
			};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/integration_mappings/teams')
					.query({
						partner_item_id: partnerItemId,
						partner_item_type: partnerItemType,
						box_item_id: boxItemId,
						box_item_type: boxItemType,
					})
					.reply(200, fixture, {
						'Content-Type': 'application/json',
					}),
			)
			.stderr()
			.stdout()
			.command([
				'integration-mappings:teams:list',
				`--partner-item-id=${partnerItemId}`,
				`--partner-item-type=${partnerItemType}`,
				`--box-item-id=${boxItemId}`,
				`--box-item-type=${boxItemType}`,
				'--json',
				'--token=test',
			])
			.it('should list Teams integration mappings', (ctx) => {
				assert.equal(ctx.stderr, '');
				assert.deepEqual(JSON.parse(ctx.stdout), expectedResult);
			});
	});

	describe('integration-mappings:teams:create', () => {
		let partnerItemId = '1234',
			partnerItemType = 'channel',
			boxItemId = '1234',
			partnerItemTeamId = 'hjgjgjg-bhhj-564a-b643-hghgj685u',
			partnerItemTenantId = 'E1234567',
			fixture = getFixture(
				'integration-mappings/post_integration_mappings_teams',
			),
			expectedResult = {
				id: '12345',
				type: 'integration_mapping',
				boxItem: {
					id: '42037322',
					type: 'folder',
				},
				createdAt: {
					value: '2012-12-12T18:53:43.000Z',
				},
				integrationType: 'teams',
				isOverriddenByManualMapping: true,
				modifiedAt: {
					value: '2012-12-12T18:53:43.000Z',
				},
				partnerItem: {
					id: '19%3ABCD-Avgfggkggyftdtfgghjhkhkhh%40thread:tacv2',
					tenantId: 'E1234567',
					type: 'channel',
				},
			};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/2.0/integration_mappings/teams', {
						partner_item: {
							type: 'channel',
							id: partnerItemId,
							tenant_id: 'E1234567',
							team_id: partnerItemTeamId,
						},
						box_item: {
							type: 'folder',
							id: boxItemId,
						},
					})
					.reply(200, fixture, {
						'Content-Type': 'application/json',
					}),
			)
			.stderr()
			.stdout()
			.command([
				'integration-mappings:teams:create',
				boxItemId,
				partnerItemId,
				partnerItemType,
				partnerItemTeamId,
				partnerItemTenantId,
				'--json',
				'--token=test',
			])
			.it('should create a Teams integration mapping', (ctx) => {
				assert.equal(ctx.stderr, '');
				assert.deepEqual(JSON.parse(ctx.stdout), expectedResult);
			});
	});

	describe('integration-mappings:teams:update', () => {
		let integrationMappingId = '12345',
			boxItemId = '7890',
			fixture = getFixture(
				'integration-mappings/put_integration_mappings_teams_id',
			),
			expectedResult = {
				id: '12345',
				type: 'integration_mapping',
				boxItem: {
					id: '7890',
					type: 'folder',
				},
				createdAt: {
					value: '2012-12-12T18:53:43.000Z',
				},
				integrationType: 'teams',
				isOverriddenByManualMapping: true,
				modifiedAt: {
					value: '2012-12-12T18:53:43.000Z',
				},
				partnerItem: {
					id: '19%3ABCD-Avgfggkggyftdtfgghjhkhkhh%40thread:tacv2',
					tenantId: 'E1234567',
					type: 'channel',
				},
			};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/integration_mappings/teams/${integrationMappingId}`, {
						box_item: {
							id: boxItemId,
							type: 'folder',
						},
					})
					.reply(200, fixture, {
						'Content-Type': 'application/json',
					}),
			)
			.stderr()
			.stdout()
			.command([
				'integration-mappings:teams:update',
				integrationMappingId,
				`--box-item-id=${boxItemId}`,
				'--json',
				'--token=test',
			])
			.it('should update a Teams integration mapping', (ctx) => {
				assert.equal(ctx.stderr, '');
				assert.deepEqual(JSON.parse(ctx.stdout), expectedResult);
			});
	});

	describe('integration-mappings:teams:delete', () => {
		let integrationMappingId = '12345';

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.delete(`/2.0/integration_mappings/teams/${integrationMappingId}`)
					.reply(204),
			)
			.stderr()
			.command([
				'integration-mappings:teams:delete',
				integrationMappingId,
				'--token=test',
			])
			.it('should delete a Teams integration mapping', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Deleted Teams integration mapping ${integrationMappingId}${os.EOL}`,
				);
			});
	});
});
