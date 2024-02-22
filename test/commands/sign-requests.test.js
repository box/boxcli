'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Sign requests', () => {
	describe('sign-requests', () => {
		const fixture = getFixture('sign-requests/get_sign_requests');

		test
			.nock(TEST_API_ROOT, api => api.get('/2.0/sign_requests').reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-requests',
				'--json',
				'--token=test'
			])
			.it('should list sign requests', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:get', () => {
		let signRequestId = '6742981',
			fixture = getFixture('sign-requests/get_sign_request_by_id');

		test
			.nock(TEST_API_ROOT, api => api
				.get(
					`/2.0/sign_requests/${signRequestId}`
				)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-requests:get',
				signRequestId,
				'--json',
				'--token=test'
			])
			.it('should get a sign request by id', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:create', () => {
		let signerEmail = 'bob@example.com',
			signerRedirectUrl = 'https://box.com/redirect_url_signer_1',
			signerDeclinedRedirectUrl = 'https://box.com/declined_redirect_url_signer_1',
			fileId = '1234',
			fileId2 = '2345',
			parentFolderId = '2345',
			documentTag1Id = '3456',
			documentTag1Value = 'hello',
			documentTag2Id = '4567',
			fixture = getFixture('sign-requests/post_sign_requests'),
			redirectUrl = 'https://box.com/redirect_url',
			declinedRedirectUrl = 'https://box.com/declined_redirect_url',
			signerGroupId = 'signers';

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/sign_requests', {
					signers: [
						{
							role: 'approver',
							email: signerEmail,
							is_in_person: true,
							redirect_url: signerRedirectUrl,
							declined_redirect_url: signerDeclinedRedirectUrl,
							signer_group_id: signerGroupId
						},
					],
					source_files: [
						{
							type: 'file',
							id: fileId,
						},
						{
							type: 'file',
							id: fileId2,
						}
					],
					parent_folder: {
						type: 'folder',
						id: parentFolderId,
					},
					prefill_tags: [
						{
							document_tag_id: documentTag1Id,
							text_value: documentTag1Value,
						},
						{
							document_tag_id: documentTag2Id,
							checkbox_value: false,
						},
					],
					redirect_url: redirectUrl,
					declined_redirect_url: declinedRedirectUrl
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-requests:create',
				`--signer=email=${signerEmail},role=approver,is_in_person=1,redirect_url=${signerRedirectUrl},declined_redirect_url=${signerDeclinedRedirectUrl},group_id=${signerGroupId}`,
				`--source-files=${fileId},${fileId2}`,
				`--parent-folder=${parentFolderId}`,
				`--prefill-tag=id=${documentTag1Id},text=${documentTag1Value}`,
				`--prefill-tag=id=${documentTag2Id},checkbox=0`,
				`--redirect-url=${redirectUrl}`,
				`--declined-redirect-url=${declinedRedirectUrl}`,
				'--json',
				'--token=test',
			])
			.it('should create a sign request with snake case', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/sign_requests', {
					signers: [
						{
							role: 'approver',
							email: signerEmail,
							is_in_person: true,
							redirect_url: signerRedirectUrl,
							declined_redirect_url: signerDeclinedRedirectUrl,
							signer_group_id: signerGroupId
						},
					],
					source_files: [
						{
							type: 'file',
							id: fileId,
						},
						{
							type: 'file',
							id: fileId2,
						}
					],
					parent_folder: {
						type: 'folder',
						id: parentFolderId,
					},
					prefill_tags: [
						{
							document_tag_id: documentTag1Id,
							text_value: documentTag1Value,
						},
						{
							document_tag_id: documentTag2Id,
							checkbox_value: false,
						},
					],
					redirect_url: redirectUrl,
					declined_redirect_url: declinedRedirectUrl
				})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'sign-requests:create',
				`--signer=email=${signerEmail},role=approver,is-in-person=1,redirect-url=${signerRedirectUrl},declined-redirect-url=${signerDeclinedRedirectUrl},group-id=${signerGroupId}`,
				`--source-files=${fileId},${fileId2}`,
				`--parent-folder=${parentFolderId}`,
				`--prefill-tag=id=${documentTag1Id},text=${documentTag1Value}`,
				`--prefill-tag=id=${documentTag2Id},checkbox=0`,
				`--redirect-url=${redirectUrl}`,
				`--declined-redirect-url=${declinedRedirectUrl}`,
				'--json',
				'--token=test',
			])
			.it('should create a sign request with kebab case', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

	});

	describe('sign-requests:cancel', () => {
		let signRequestId = '6742981',
			fixture = getFixture('sign-requests/post_sign_requests_id_cancel');

		test
			.nock(TEST_API_ROOT, api => api
				.post(
					`/2.0/sign_requests/${signRequestId}/cancel`
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
			.it('should cancel a sign request by id', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('sign-requests:resend', () => {
		let signRequestId = '6742981';

		test
			.nock(TEST_API_ROOT, api => api
				.post(
					`/2.0/sign_requests/${signRequestId}/resend`
				)
				.reply(200)
			)
			.stderr()
			.command([
				'sign-requests:resend',
				signRequestId,
				'--json',
				'--token=test',
			])
			.it('should resend a sign request by id', ctx => {
				assert.equal(
					ctx.stderr,
					`Resent sign request ${signRequestId}${os.EOL}`
				);
			});
	});
});
