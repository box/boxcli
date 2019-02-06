'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');

describe('Shared-Links', () => {

	describe('shared-links:get', () => {
		let url = 'https://app.box.com/s/qwertyuiopasdfghjklzxcvbnm123456',
			fixture = getFixture('shared-links/get_shared_items'),
			yamlOutput = getFixture('output/shared_links_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/shared_items')
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'shared-links:get',
				url,
				'--json',
				'--token=test'
			])
			.it('should get information from a shared item URL (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/shared_items')
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'shared-links:get',
				url,
				'--token=test'
			])
			.it('should get information from a shared item URL (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/shared_items')
				.query({fields: 'name'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'shared-links:get',
				url,
				'--fields=name',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});
});
