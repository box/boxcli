'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');

describe('Web Links', function () {
	describe('web-links:get', function () {
		let webLinkId = '6742981',
			fixture = getFixture('web-links/get_web_links_id'),
			yamlOutput = getFixture('output/web_links_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/web_links/${webLinkId}`).reply(200, fixture)
		)
			.stdout()
			.command(['web-links:get', webLinkId, '--json', '--token=test'])
			.it(
				'should get information about a web link (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/web_links/${webLinkId}`).reply(200, fixture)
		)
			.stdout()
			.command(['web-links:get', webLinkId, '--token=test'])
			.it(
				'should get information about a web link (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
	});

	describe('web-links:create', function () {
		let url = 'https://www.box.com',
			parentId = '848123342',
			name = 'Box Website!',
			description = 'The Box marketing site',
			fixture = getFixture('web-links/post_web_links'),
			yamlOutput = getFixture('output/web_links_create_yaml.txt');

		let expectedBody = {
			parent: { id: parentId },
			url,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/web_links', { ...expectedBody, name })
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'web-links:create',
				url,
				`--parent-id=${parentId}`,
				`-n=${name}`,
				'--json',
				'--token=test',
			])
			.it(
				'should create a web link with the name flag passed (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/web_links', { ...expectedBody, name })
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'web-links:create',
				url,
				`--parent-id=${parentId}`,
				`-n=${name}`,
				'--token=test',
			])
			.it(
				'should create a web link with the name flag passed (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/web_links', { ...expectedBody, description })
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'web-links:create',
				url,
				`--parent-id=${parentId}`,
				`--description=${description}`,
				'--json',
				'--token=test',
			])
			.it(
				'should create a web link with the description flag passed',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);
	});

	describe('web-links:update', function () {
		let webLinkId = '6742981',
			url = 'https://www.box.com',
			name = 'Box Website!',
			description = 'The Box marketing site',
			fixture = getFixture('web-links/put_web_links_id'),
			yamlOutput = getFixture('output/web_links_update_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/web_links/${webLinkId}`, { name, url })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'web-links:update',
				webLinkId,
				`-u=${url}`,
				`-n=${name}`,
				'--json',
				'--token=test',
			])
			.it(
				'should update a web link with url and name flags passed (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/web_links/${webLinkId}`, { name, url })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'web-links:update',
				webLinkId,
				`-u=${url}`,
				`-n=${name}`,
				'--token=test',
			])
			.it(
				'should update a web link with url and name flags passed (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/web_links/${webLinkId}`, { description })
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'web-links:update',
				webLinkId,
				`--description=${description}`,
				'--json',
				'--token=test',
			])
			.it(
				'should update a web link with description flag passed',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);
	});

	describe('web-links:move', function () {
		let webLinkId = '6742981',
			parentFolderId = '848123342',
			fixture = getFixture('web-links/put_web_links_id'),
			yamlOutput = getFixture('output/web_links_move_yaml.txt');

		let expectedBody = {
			parent: { id: parentFolderId },
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/web_links/${webLinkId}`, expectedBody)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'web-links:move',
				webLinkId,
				parentFolderId,
				'--json',
				'--token=test',
			])
			.it('should move a web link (JSON Output)', (context) => {
				assert.equal(context.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/web_links/${webLinkId}`, expectedBody)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'web-links:move',
				webLinkId,
				parentFolderId,
				'--token=test',
			])
			.it('should move a web link (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
	});

	describe('web-links:delete', function () {
		let webLinkId = '6742981';

		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/web_links/${webLinkId}`).reply(204)
		)
			.stderr()
			.command(['web-links:delete', webLinkId, '--token=test'])
			.it('should delete a weblink', (context) => {
				assert.equal(
					context.stderr,
					`Deleted weblink ${webLinkId}${os.EOL}`
				);
			});
	});
});
