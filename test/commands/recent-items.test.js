'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');

describe('Recent Items', () => {

	describe('recent-items', () => {
		let fixture = getFixture('recent-items/get_recent_items_page_1'),
			fixture2 = getFixture('recent-items/get_recent_items_page_2'),
			jsonOutput = getFixture('output/recent_items_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/recent_items')
				.reply(200, fixture)
				.get('/2.0/recent_items')
				.query({
					marker: 'ZDF123'
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'recent-items',
				'--json',
				'--token=test'
			])
			.it('should list information about files accessed in the past 90 days up to a 1000 items (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});
});
