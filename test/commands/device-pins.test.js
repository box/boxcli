'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');

describe('Device Pins', function () {
	describe('device-pins:get', function () {
		let devicePinId = '123456789',
			fixture = getFixture('device-pins/get_device_pinners_id'),
			yamlOutput = getFixture('output/device_pins_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/device_pinners/${devicePinId}`).reply(200, fixture)
		)
			.stdout()
			.command(['device-pins:get', devicePinId, '--json', '--token=test'])
			.it(
				'should get information about an individual device pin (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/device_pinners/${devicePinId}`).reply(200, fixture)
		)
			.stdout()
			.command(['device-pins:get', devicePinId, '--token=test'])
			.it(
				'should get information about an individual device pin (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
	});

	describe('device-pins:delete', function () {
		let devicePinId = '123456789';

		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/device_pinners/${devicePinId}`).reply(204)
		)
			.stderr()
			.command(['device-pins:delete', devicePinId, '--token=test'])
			.it('should delete individual device pin', (context) => {
				assert.equal(
					context.stderr,
					`Deleted device pin ${devicePinId}${os.EOL}`
				);
			});
	});

	describe('device-pins', function () {
		let enterpriseId = '123456',
			direction = 'ASC',
			userMeFixture = getFixture('device-pins/get_users_me'),
			fixture = getFixture('device-pins/get_device_pinners_page_1'),
			fixture2 = getFixture('device-pins/get_device_pinners_page_2'),
			jsonOutput = getFixture('output/device_pins_list_json.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/users/me')
				.query({
					fields: 'enterprise',
				})
				.reply(200, userMeFixture)
				.get(`/2.0/enterprises/${enterpriseId}/device_pinners`)
				.query({ direction, limit: 1000 })
				.reply(200, fixture)
				.get(`/2.0/enterprises/${enterpriseId}/device_pinners`)
				.query({
					direction,
					marker: 'ZDEF67',
					limit: 1000,
				})
				.reply(200, fixture2)
		)
			.stdout()
			.command([
				'device-pins',
				`--direction=${direction}`,
				'--json',
				'--token=test',
			])
			.it(
				'should list all the device pins within a given enterprise with the direction flag passed (JSON Output)',
				(context) => {
					assert.equal(context.stdout, jsonOutput);
				}
			);
	});
});
