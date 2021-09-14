'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');

describe('Metadata Query', () => {
	describe('metadata-query', () => {
		const request = {
				from: 'enterprise_123456.contractTemplate',
				query: 'amount >= :value',
				query_params: {
					value: '105',
				},
				fields: [
					'created_at',
					'metadata.enterprise_123456.contractTemplate.amount',
					'metadata.enterprise_123456.contractTemplate.customerName',
				],
				ancestor_folder_id: '5555',
				order_by: [
					{
						field_key: 'amount',
						direction: 'asc',
					},
				],
				limit: 100,
			},
			fixture = getFixture('metadata-query/post_metadata_queries_execute_read');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/2.0/metadata_queries/execute_read', request)
					.reply(200, fixture)
			)
			.stdout()
			.command([
				'metadata-query',
				request.from,
				request.ancestor_folder_id,
				`--query=${request.query}`,
				`--query-params=value=${request.query_params.value}`,
				`--extra-fields=${request.fields.join(',')}`,
				`--order-by=${request.order_by[0].field_key}=${request.order_by[0].direction}`,
				`--limit=${request.limit}`,
				'--json',
				'--token=test',
			])
			.it('should query metadata', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});
});
