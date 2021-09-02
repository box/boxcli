'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Sign requests', () => {
	describe('sign-requests', () => {
		const fixture = getFixture('sign-requests/get_sign_requests');

		test
			.nock(TEST_API_ROOT, (api) =>
				api.get(`/2.0/sign_requests`).reply(200, fixture)
			)
			.stdout()
			.command(['sign-requests', '--json', '--token=test'])
			.it('should list sign requests', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:get', () => {
		let signRequestId = '6742981',
			fixture = getFixture('sign-requests/get_sign_request_by_id');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get(
						`/2.0/sign_requests/${signRequestId}?sign_request_id=${signRequestId}`
					)
					.reply(200, fixture)
			)
			.stdout()
			.command(['sign-requests:get', signRequestId, '--json', '--token=test'])
			.it('should get a sign request by id', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:create', () => {
		let signerEmail = 'bob@example.com',
			fileId = '1234',
			parentFolderId = '2345',
			fixture = getFixture('sign-requests/post_sign_requests');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post(`/2.0/sign_requests`, {
						signers: [
							{
								role: 'signer',
								email: signerEmail,
							},
						],
						source_files: [
							{
								type: 'file',
								id: fileId,
							},
						],
						parent_folder: {
							type: 'folder',
							id: parentFolderId,
						},
					})
					.reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-requests:create',
				`--signers=${signerEmail}`,
				`--source-files=${fileId}`,
				`--parent-folder=${parentFolderId}`,
				'--json',
				'--token=test',
			])
			.it('should create a sign request', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:cancel', () => {
		let signRequestId = '6742981',
			fixture = getFixture('sign-requests/post_sign_requests_id_cancel');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post(
						`/2.0/sign_requests/${signRequestId}/cancel?sign_request_id=${signRequestId}`
					)
					.reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-requests:cancel',
				signRequestId,
				'--json',
				'--token=test',
			])
			.it('should cancel a sign request by id', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:resend', () => {
		let signRequestId = '6742981',
			fixture = getFixture('sign-requests/post_sign_requests_id_resend');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post(
						`/2.0/sign_requests/${signRequestId}/resend?sign_request_id=${signRequestId}`
					)
					.reply(200, fixture)
			)
			.stderr()
			.command([
				'sign-requests:resend',
				signRequestId,
				'--json',
				'--token=test',
			])
			.it('should resend a sign request by id', (ctx) => {
				assert.equal(
					ctx.stderr,
					`Resent sign request ${signRequestId}${os.EOL}`
				);
			});
	});
});
