'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');
const leche = require('leche');

describe('Webhooks', function () {
	describe('webhooks:get', function () {
		let webhookId = '1234',
			fixture = getFixture('webhooks/get_webhooks_id'),
			yamlOutput = getFixture('output/webhooks_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/webhooks/${webhookId}`).reply(200, fixture)
		)
			.stdout()
			.command(['webhooks:get', webhookId, '--json', '--token=test'])
			.it(
				'should get information about a webhook (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/webhooks/${webhookId}`).reply(200, fixture)
		)
			.stdout()
			.command(['webhooks:get', webhookId, '--token=test'])
			.it(
				'should get information about a webhook (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
	});

	leche.withData(['webhooks', 'webhooks:list'], function (command) {

		describe(command, function () {
			let fixture = getFixture('webhooks/get_webhooks_page_1'),
				fixture2 = getFixture('webhooks/get_webhooks_page_2'),
				jsonOutput = getFixture('output/webhooks_list_json.txt');

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/webhooks')
					.query({ limit: 1000 })
					.reply(200, fixture)
					.get('/2.0/webhooks')
					.query({
						marker: 'ZmlQZS0xLTE%3D',
						limit: 1000,
					})
					.reply(200, fixture2)
			)
				.stdout()
				.command([command, '--json', '--token=test'])
				.it('should list all webhooks (JSON Output)', (context) => {
					assert.equal(context.stdout, jsonOutput);
				});
		});
	});

	describe('webhooks:delete', function () {
		let webhookId = '1234';

		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/webhooks/${webhookId}`).reply(204)
		)
			.stderr()
			.command(['webhooks:delete', webhookId, '--token=test'])
			.it('should delete a webhook', (context) => {
				assert.equal(
					context.stderr,
					`Deleted webhook ${webhookId}${os.EOL}`
				);
			});
	});

	describe('webhooks:create', function () {
		let id = '1234',
			type = 'file',
			triggers = 'FILE.DOWNLOADED,FILE.UPLOADED',
			address = 'https://dev.name/actions/file_changed',
			fixture = getFixture('webhooks/post_webhooks'),
			yamlOutput = getFixture('output/webhooks_create_yaml.txt');

		let expectedBody = {
			target: {
				id,
				type,
			},
			triggers: ['FILE.DOWNLOADED', 'FILE.UPLOADED'],
			address,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api.post('/2.0/webhooks', expectedBody).reply(200, fixture)
		)
			.stdout()
			.command([
				'webhooks:create',
				type,
				id,
				`--triggers=${triggers}`,
				`--address=${address}`,
				'--json',
				'--token=test',
			])
			.it('should create a new webhook (JSON Output)', (context) => {
				assert.equal(context.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api.post('/2.0/webhooks', expectedBody).reply(200, fixture)
		)
			.stdout()
			.command([
				'webhooks:create',
				type,
				id,
				`-T=${triggers}`,
				`-a=${address}`,
				'--token=test',
			])
			.it('should create a new webhook (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api.post('/2.0/webhooks', expectedBody).reply(200, fixture)
		)
			.stdout()
			.command([
				'webhooks:create',
				type,
				id,
				`--triggers=${triggers}`,
				`--address=${address}`,
				'--id-only',
				'--token=test',
			])
			.it('should create a new webhook (ID Output)', (context) => {
				assert.equal(
					context.stdout,
					`${JSON.parse(fixture).id}${os.EOL}`
				);
			});
	});

	describe('webhooks:update', function () {
		let webhookId = '1234',
			triggers = 'FILE.DOWNLOADED,FILE.UPLOADED',
			address = 'https://dev.name/actions/file_changed',
			fixture = getFixture('webhooks/put_webhooks_id'),
			yamlOutput = getFixture('output/webhooks_update_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/webhooks/${webhookId}`, {
					triggers: triggers.split(','),
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'webhooks:update',
				webhookId,
				`--triggers=${triggers}`,
				'--json',
				'--token=test',
			])
			.it(
				'should update a webhook with triggers flag passed (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/webhooks/${webhookId}`, {
					triggers: triggers.split(','),
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'webhooks:update',
				webhookId,
				`--triggers=${triggers}`,
				'--token=test',
			])
			.it(
				'should update a webhook with triggers flag passed (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/webhooks/${webhookId}`, { address })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'webhooks:update',
				webhookId,
				`--address=${address}`,
				'--json',
				'--token=test',
			])
			.it(
				'should update a webhook with address flag passed',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);
	});
});
