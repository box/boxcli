'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');

describe('Metadata Query', function () {
	describe('metadata-query', function () {
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
					value2: 'String',
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
			requestWithMultipleArrayQueryParameters = {
				from: 'enterprise_123456.contractTemplate',
				query: 'name = :customerName',
				query_params: {
					customerName: ['John Doe', 'Jane Doe'],
					customerName2: ['Doe John', 'Doe Jane'],
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
			fixture = getFixture(
				'metadata-query/post_metadata_queries_execute_read'
			);

		test.nock(TEST_API_ROOT, (api) =>
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
				`--query-params=value=${request.query_params.value}f`,
				`--extra-fields=${request.fields.join(',')}`,
				`--order-by=${request.order_by[0].field_key}=${request.order_by[0].direction}`,
				`--limit=${request.limit}`,
				'--json',
				'--token=test',
			])
			.it('should query metadata', (context) => {
				assert.equal(context.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					'/2.0/metadata_queries/execute_read',
					requestWithMultipleValues
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-query',
				requestWithMultipleValues.from,
				requestWithMultipleValues.ancestor_folder_id,
				`--query=${requestWithMultipleValues.query}`,
				`--query-param=value=${requestWithMultipleValues.query_params.value}f`,
				`--query-param=value2=${requestWithMultipleValues.query_params.value2}`,
				`--extra-fields=${requestWithMultipleValues.fields.join(',')}`,
				`--order-by=${requestWithMultipleValues.order_by[0].field_key}=${requestWithMultipleValues.order_by[0].direction}`,
				`--limit=${requestWithMultipleValues.limit}`,
				'--json',
				'--token=test',
			])
			.it(
				'should query metadata with multiple query-param',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					'/2.0/metadata_queries/execute_read',
					requestWithMultipleArrayValues
				)
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
			.it('should query metadata with query-param', (context) => {
				assert.equal(context.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					'/2.0/metadata_queries/execute_read',
					requestWithMultipleArrayQueryParameters
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-query',
				requestWithMultipleArrayQueryParameters.from,
				requestWithMultipleArrayQueryParameters.ancestor_folder_id,
				`--query=${requestWithMultipleArrayQueryParameters.query}`,
				`--query-param-array=customerName=${requestWithMultipleArrayQueryParameters.query_params.customerName.join(',')}`,
				`--query-param-array=customerName2=${requestWithMultipleArrayQueryParameters.query_params.customerName2.join(',')}`,
				`--extra-fields=${requestWithMultipleArrayQueryParameters.fields.join(',')}`,
				`--order-by=${requestWithMultipleArrayQueryParameters.order_by[0].field_key}=${requestWithMultipleArrayQueryParameters.order_by[0].direction}`,
				`--limit=${requestWithMultipleArrayQueryParameters.limit}`,
				'--json',
				'--token=test',
			])
			.it(
				'should query metadata with multiple query-params-array',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);
	});
});
