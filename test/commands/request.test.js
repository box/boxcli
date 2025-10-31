'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');
const crypto = require('node:crypto');

describe('Manual Request', function () {
	describe('request', function () {
		let fixture = `{}${os.EOL}`,
			jsonBody = {
				foo: 'bar',
				baz: 123.456,
			},
			bufferBody = crypto.randomFillSync(Buffer.alloc(10));

		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/widgets').reply(200, fixture)
		)
			.stdout()
			.command(['request', '/widgets', '--json', '--token=test'])
			.it(
				'should make simple GET request when resource given as path (JSON Output)',
				(context) => {
					let expectedObject = {
						statusCode: 200,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/widgets').reply(200, fixture)
		)
			.stdout()
			.command(['request', '/widgets', '--token=test'])
			.it(
				'should make simple GET request when resource given as path (YAML Output)',
				(context) => {
					let lb = '\n';
					let expectedOutput = `Status Code: 200${lb}Headers: {}${lb}Body: {}${os.EOL}`;

					assert.equal(context.stdout, expectedOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/widgets').reply(200, fixture)
		)
			.stdout()
			.command([
				'request',
				'https://api.box.com/2.0/widgets',
				'--json',
				'--token=test',
			])
			.it(
				'should make simple GET request when resource given as URL',
				(context) => {
					let expectedObject = {
						statusCode: 200,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/widgets')
				.matchHeader('X-Box-Header', 'foo=bar')
				.matchHeader('X-Box-Header2', 'baz quux')
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'request',
				'https://api.box.com/2.0/widgets',
				'--header=X-Box-Header: foo=bar',
				'-HX-Box-Header2: baz quux',
				'--json',
				'--token=test',
			])
			.it(
				'should send request headers when header flags are passed',
				(context) => {
					let expectedObject = {
						statusCode: 200,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/widgets')
				.query({
					foo: 'bar==bar',
					baz: 'quux slod quop',
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'request',
				'https://api.box.com/2.0/widgets',
				'--query=foo=bar%3D%3Dbar&baz=quux slod%20quop',
				'--json',
				'--token=test',
			])
			.it(
				'should send query params when --query flag is passed in key=value format',
				(context) => {
					let expectedObject = {
						statusCode: 200,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/widgets')
				.query({
					foo: 'bar==bar',
					baz: 'quux slod quop',
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'request',
				'https://api.box.com/2.0/widgets',
				'--query={"foo":"bar==bar","baz":"quux slod quop"}',
				'--json',
				'--token=test',
			])
			.it(
				'should send query params when --query flag is passed in JSON format',
				(context) => {
					let expectedObject = {
						statusCode: 200,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/widgets', jsonBody)
				.matchHeader('Content-Type', 'application/json')
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'request',
				'https://api.box.com/2.0/widgets',
				'--method=POST',
				`--body=${JSON.stringify(jsonBody)}`,
				'--json',
				'--token=test',
			])
			.it(
				'should send request body when --body flag is passed in JSON format',
				(context) => {
					let expectedObject = {
						statusCode: 201,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(
					'/2.0/widgets',
					(body) => body === bufferBody.toString('utf8')
				)
				.matchHeader('Content-Type', 'application/octet-stream')
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'request',
				'https://api.box.com/2.0/widgets',
				'-XPOST',
				`--body=${bufferBody.toString('utf8')}`,
				'--json',
				'--token=test',
			])
			.it(
				'should send request body when --body flag is passed in non-JSON format',
				(context) => {
					let expectedObject = {
						statusCode: 201,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					'/2.0/widgets/123',
					(body) => body === bufferBody.toString('hex')
				)
				.matchHeader('Content-Type', 'text/plain')
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'request',
				'/widgets/123',
				'-XPUT',
				`--body=${bufferBody.toString('hex')}`,
				'--header=Content-Type: text/plain',
				'--json',
				'--token=test',
			])
			.it(
				'should allow overriding Content-Type header when both --body and --header flags are passed',
				(context) => {
					let expectedObject = {
						statusCode: 200,
						headers: {},
						body: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.delete('/2.0/widgets/123').reply(204)
		)
			.stdout()
			.command([
				'request',
				'/widgets/123',
				'-XDELETE',
				'--json',
				'--token=test',
			])
			.it(
				'should allow DELETE request when method is set to DELETE',
				(context) => {
					let expectedObject = {
						statusCode: 204,
						headers: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.options('/2.0/widgets').reply(204)
		)
			.stdout()
			.command([
				'request',
				'/widgets',
				'-XOPTIONS',
				'--json',
				'--token=test',
			])
			.it(
				'should allow OPTIONS request when method is set to OPTIONS',
				(context) => {
					let expectedObject = {
						statusCode: 204,
						headers: {},
					};

					assert.equal(
						context.stdout,
						`${JSON.stringify(expectedObject, null, 4)}${os.EOL}`
					);
				}
			);
	});
});
