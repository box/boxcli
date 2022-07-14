'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('File Requests', () => {
	describe('file-requests:get', () => {
		let fileRequestId = '123456789',
			fixture = getFixture('file-requests/get_file_requests_id'),
			yamlOutput = getFixture('output/file_requests_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, (api) =>
				api.get(`/2.0/file_requests/${fileRequestId}`).reply(200, fixture)
			)
			.stdout()
			.command(['file-requests:get', fileRequestId, '--json', '--token=test'])
			.it(
				'should get information about an individual file request (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, fixture);
				}
			);

		test
			.nock(TEST_API_ROOT, (api) =>
				api.get(`/2.0/file_requests/${fileRequestId}`).reply(200, fixture)
			)
			.stdout()
			.command(['file-requests:get', fileRequestId, '--token=test'])
			.it(
				'should get information about an individual file request (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);
	});

	describe('file-requests:delete', () => {
		let fileRequestId = '123456789';

		test
			.nock(TEST_API_ROOT, (api) =>
				api.delete(`/2.0/file_requests/${fileRequestId}`).reply(204)
			)
			.stderr()
			.command(['file-requests:delete', fileRequestId, '--token=test'])
			.it('should delete individual file request', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Deleted file request ${fileRequestId}${os.EOL}`
				);
			});
	});

	let fileRequestId = '1234567890',
		parentFolderId = '987654321';

	let requestBody = {
		folder: {
			id: parentFolderId,
			type: 'folder',
		},
	};

	let title = 'New title';
	let description = 'New Description';
	let expiresAt = '2023-01-01T08:00:00+00:00';
	let status = 'active';

	let addParams = {
		title: title,
		description: description,
		expires_at: expiresAt,
		is_description_required: true,
		is_email_required: true,
		status: status,
	};

	let addFlags = [
		`--title=${title}`,
		`--description=${description}`,
		`--expires-at=${expiresAt}`,
		`--description-required`,
		`--email-required`,
		`--status=${status}`,
	];

	describe('file-requests:update', () => {
		let updateFixture = getFixture('file-requests/put_file_requests_id'),
			yamlOutput = getFixture('output/file_requests_update_yaml.txt');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/file_requests/${fileRequestId}`, {
						...addParams,
					})
					.reply(200, updateFixture)
			)
			.stdout()
			.command([
				'file-requests:update',
				fileRequestId,
				...addFlags,
				'--json',
				'--token=test',
			])
			.it('should update a file request (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, updateFixture);
			});

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.put(`/2.0/file_requests/${fileRequestId}`, {
						...addParams,
					})
					.reply(200, updateFixture)
			)
			.stdout()
			.command([
				'file-requests:update',
				fileRequestId,
				...addFlags,
				'--token=test',
			])
			.it('should update a file request (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('file-requests:copy', () => {
		let copyFixture = getFixture('file-requests/post_file_requests_id_copy'),
			yamlOutput = getFixture('output/file_requests_copy_yaml.txt');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post(`/2.0/file_requests/${fileRequestId}/copy`, requestBody)
					.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'file-requests:copy',
				fileRequestId,
				parentFolderId,
				'--json',
				'--token=test',
			])
			.it(
				'should copy a file request to a different folder (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, copyFixture);
				}
			);

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post(`/2.0/file_requests/${fileRequestId}/copy`, requestBody)
					.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'file-requests:copy',
				fileRequestId,
				parentFolderId,
				'--token=test',
			])
			.it(
				'should copy a file request to a different folder (YAML Output)',
				(ctx) => {
					assert.equal(ctx.stdout, yamlOutput);
				}
			);

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post(`/2.0/file_requests/${fileRequestId}/copy`, {
						...requestBody,
						...addParams,
					})
					.reply(201, copyFixture)
			)
			.stdout()
			.command([
				'file-requests:copy',
				fileRequestId,
				parentFolderId,
				...addFlags,
				'--json',
				'--token=test',
			])
			.it(
				'should send optional parameters when optional flags are passed',
				(ctx) => {
					assert.equal(ctx.stdout, copyFixture);
				}
			);
	});
});
