'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');

describe('Sign templates', () => {
	describe('sign-templates', () => {
		const fixture = getFixture('sign-templates/get_sign_templates');
		const jsonOutput = getFixture('output/sign_templates_json.txt');

		test
			.nock(TEST_API_ROOT, api => api.get('/2.0/sign_templates').reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-templates',
				'--json',
				'--token=test'
			])
			.it('should list sign templates', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});
	});

	describe('sign-templates:get', () => {
		let signTemplateId = '6742981',
			fixture = getFixture('sign-templates/get_sign_template_by_id');

		test
			.nock(TEST_API_ROOT, api => api
				.get(
					`/2.0/sign_templates/${signTemplateId}`
				)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-templates:get',
				signTemplateId,
				'--json',
				'--token=test'
			])
			.it('should get a sign template by id', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});
});
