'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Terms of Service', () => {
	describe('terms-of-service:get', () => {
		let tosId = '12345',
			fixture = getFixture('terms-of-service/get_terms_of_service_id'),
			yamlOutput = getFixture('output/terms_of_service_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/terms_of_services/${tosId}`).reply(200, fixture)
		)
			.stdout()
			.command(['terms-of-service:get', tosId, '--json', '--token=test'])
			.it(
				'should get information on a terms of service (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/terms_of_services/${tosId}`).reply(200, fixture)
		)
			.stdout()
			.command(['terms-of-service:get', tosId, '--token=test'])
			.it(
				'should get information on a terms of service (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);
	});

	describe('terms-of-service', () => {
		let tosType = 'managed',
			fixture = getFixture('terms-of-service/get_terms_of_services'),
			jsonOutput = getFixture('output/terms_of_service_list_json.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/terms_of_services')
				.query({
					tos_type: tosType,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service',
				`--type=${tosType}`,
				'--json',
				'--token=test',
			])
			.it(
				'should list terms of services for your enterprise with the type flag passed (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);
	});

	describe('terms-of-service:create', () => {
		let tosType = 'managed',
			status = 'enabled',
			text = 'test',
			fixture = getFixture('terms-of-service/post_terms_of_service_id'),
			yamlOutput = getFixture('output/terms_of_service_create_yaml.txt');

		let expectedBody = {
			tos_type: tosType,
			status,
			text,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api.post('/2.0/terms_of_services', expectedBody).reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service:create',
				`--type=${tosType}`,
				`--status=${status}`,
				`--text=${text}`,
				'--json',
				'--token=test',
			])
			.it('should create a terms of service (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api.post('/2.0/terms_of_services').reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service:create',
				`--type=${tosType}`,
				`--status=${status}`,
				`--text=${text}`,
				'--token=test',
			])
			.it('should create a terms of service (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('terms-of-service:update', () => {
		let tosId = '12345',
			status = 'enabled',
			text = 'test',
			fixture = getFixture('terms-of-service/put_terms_of_service_id'),
			yamlOutput = getFixture('output/terms_of_service_update_yaml.txt');

		let expectedBody = {
			status,
			text,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/terms_of_services/${tosId}`, expectedBody)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service:update',
				tosId,
				`--status=${status}`,
				`--text=${text}`,
				'--json',
				'--token=test',
			])
			.it('should update a terms of service (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/terms_of_services/${tosId}`, expectedBody)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service:update',
				tosId,
				`--status=${status}`,
				`--text=${text}`,
				'--token=test',
			])
			.it('should update a terms of service (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('terms-of-service:get-user-status', () => {
		let tosId = '1234',
			userId = '7777',
			fixture = getFixture(
				'terms-of-service/get_terms_of_service_user_statuses'
			),
			yamlOutput = getFixture(
				'output/terms_of_service_get_user_status_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/terms_of_service_user_statuses')
				.query({
					tos_id: tosId,
					user_id: userId,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service:get-user-status',
				tosId,
				`--user-id=${userId}`,
				'--json',
				'--token=test',
			])
			.it(
				"should get a user's status on a terms of service (JSON Output)",
				(ctx) => {
					let expectedObject = JSON.parse(fixture).entries[0];
					assert.equal(
						ctx.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/terms_of_service_user_statuses')
				.query({
					tos_id: tosId,
					user_id: userId,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'terms-of-service:get-user-status',
				tosId,
				`--user-id=${userId}`,
				'--token=test',
			])
			.it(
				"should get a user's status on a terms of service (YAML Output)",
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);
	});

	describe('terms-of-service:set-user-status', () => {
		let tosId = '1234',
			userId = '7777',
			postResponse = getFixture(
				'terms-of-service/post_terms_of_service_user_statuses_409'
			),
			getResponse = getFixture(
				'terms-of-service/get_terms_of_service_user_statuses'
			),
			putResponse = getFixture(
				'terms-of-service/put_terms_of_service_user_statuses'
			),
			yamlOutput = getFixture(
				'output/terms_of_service_set_user_status_yaml.txt'
			),
			tosUserStatusId = JSON.parse(getResponse).entries[0].id;

		let user = {
			id: userId,
			type: 'user',
		};

		let expectedPostBody = {
			tos: {
				id: tosId,
				type: 'terms_of_service',
			},
			user,
			is_accepted: true,
		};

		let expectedPutBody = {
			is_accepted: true,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/terms_of_service_user_statuses', expectedPostBody)
				.reply(409, postResponse)
				.get('/2.0/terms_of_service_user_statuses')
				.query({
					tos_id: tosId,
					user_id: userId,
					fields: 'id',
				})
				.reply(200, getResponse)
				.put(
					`/2.0/terms_of_service_user_statuses/${tosUserStatusId}`,
					expectedPutBody
				)
				.reply(200, putResponse)
		)
			.stdout()
			.command([
				'terms-of-service:set-user-status',
				tosId,
				`--user-id=${userId}`,
				'--accept',
				'--json',
				'--token=test',
			])
			.it(
				"should set a user's status on a terms of service with a terms of service Id with the accept flag passed (JSON Output)",
				(ctx) => {
					assert.equal(ctx.stdout, putResponse);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/terms_of_service_user_statuses', expectedPostBody)
				.reply(409, postResponse)
				.get('/2.0/terms_of_service_user_statuses')
				.query({
					tos_id: tosId,
					user_id: userId,
					fields: 'id',
				})
				.reply(200, getResponse)
				.put(
					`/2.0/terms_of_service_user_statuses/${tosUserStatusId}`,
					expectedPutBody
				)
				.reply(200, putResponse)
		)
			.stdout()
			.command([
				'terms-of-service:set-user-status',
				tosId,
				`--user-id=${userId}`,
				'--accept',
				'--token=test',
			])
			.it(
				"should set a user's status on a terms of service with a terms of service Id with the accept flag passed (JSON Output)",
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);
	});
});
