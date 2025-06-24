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
					value: 100,
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
			requestWithMultipleValues = {
				from: 'enterprise_123456.contractTemplate',
				query: 'name = :customerName',
				query_params: {
					value: 100,
					value2: 200,
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
			requestWithMultipleArrayValues = {
				from: 'enterprise_123456.contractTemplate',
				query: 'name = :customerName',
				query_params: {
					customerName: ['John Doe', 'Jane Doe'],
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
			requestWithMultipleArrayQueryParams = {
				from: 'enterprise_123456.contractTemplate',
				query: 'name = :customerName',
				query_params: {
					customerName: ['John Doe', 'Jane Doe'],
					customerName2: ['John Doe', 'Jane Doe'],
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
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/metadata_queries/execute_read', request)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'metadata-query',
				request.from,
				request.ancestor_folder_id,
				`--query=${request.query}`,
				`--query-params=value=${request.query_params.value}f`,
				`--extra-fields=${request.fields.join(',')}`,
				`--order-by=${request.order_by[0].field_key}=${request.order_by[0].direction}`,
				`--limit=${request.limit}`,
				'--json',
				'--token=test',
			])
			.it('should query metadata', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/metadata_queries/execute_read', requestWithMultipleValues)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'metadata-query',
				requestWithMultipleValues.from,
				requestWithMultipleValues.ancestor_folder_id,
				`--query=${requestWithMultipleValues.query}`,
				'--query-param=value=100f',
				'--query-param=value2=200f',
				`--extra-fields=${requestWithMultipleValues.fields.join(',')}`,
				`--order-by=${requestWithMultipleValues.order_by[0].field_key}=${requestWithMultipleValues.order_by[0].direction}`,
				`--limit=${requestWithMultipleValues.limit}`,
				'--json',
				'--token=test',
			])
			.it('should query metadata with multiple query-param', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/metadata_queries/execute_read', requestWithMultipleArrayValues)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'metadata-query',
				requestWithMultipleArrayValues.from,
				requestWithMultipleArrayValues.ancestor_folder_id,
				`--query=${requestWithMultipleArrayValues.query}`,
				`--query-param-array=customerName=${requestWithMultipleArrayValues.query_params.customerName.join(',')}`,
				`--extra-fields=${requestWithMultipleArrayValues.fields.join(',')}`,
				`--order-by=${requestWithMultipleArrayValues.order_by[0].field_key}=${requestWithMultipleArrayValues.order_by[0].direction}`,
				`--limit=${requestWithMultipleArrayValues.limit}`,
				'--json',
				'--token=test',
			])
			.it('should query metadata with query-param', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/metadata_queries/execute_read', requestWithMultipleArrayQueryParams)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'metadata-query',
				requestWithMultipleArrayQueryParams.from,
				requestWithMultipleArrayQueryParams.ancestor_folder_id,
				`--query=${requestWithMultipleArrayQueryParams.query}`,
				`--query-param-array=customerName=${requestWithMultipleArrayQueryParams.query_params.customerName.join(',')}`,
				`--query-param-array=customerName2=${requestWithMultipleArrayQueryParams.query_params.customerName.join(',')}`,
				`--extra-fields=${requestWithMultipleArrayQueryParams.fields.join(',')}`,
				`--order-by=${requestWithMultipleArrayQueryParams.order_by[0].field_key}=${requestWithMultipleArrayQueryParams.order_by[0].direction}`,
				`--limit=${requestWithMultipleArrayQueryParams.limit}`,
				'--json',
				'--token=test',
			])
			.it('should query metadata with multiple query-params-array', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});
});
