'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Comments', () => {

	describe('comments:get', () => {
		let commentId = '123456789',
			fixture = getFixture('comments/get_comments_id'),
			yamlOutput = getFixture('output/comments_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/comments/${commentId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'comments:get',
				commentId,
				'--json',
				'--token=test'
			])
			.it('should get information about a comment (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/comments/${commentId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'comments:get',
				commentId,
				'--token=test'
			])
			.it('should get information about a comment (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('comments:update', () => {
		let commentId = '123456789',
			message = 'Looks great!',
			taggedMessage = '@[1357908642:Other User] Looks good!',
			fixture = getFixture('comments/put_comments_id'),
			yamlOutput = getFixture('output/comments_update_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/comments/${commentId}`, { message })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'comments:update',
				commentId,
				`--message=${message}`,
				'--json',
				'--token=test'
			])
			.it('should update a comment with the message flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/comments/${commentId}`, { tagged_message: taggedMessage })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'comments:update',
				commentId,
				`--tagged-message=${taggedMessage}`,
				'--json',
				'--token=test'
			])
			.it('should update a comment with the tagged-message flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/comments/${commentId}`, { message })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'comments:update',
				commentId,
				`--message=${message}`,
				'--token=test'
			])
			.it('should update a comment with the message flag passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('comments:delete', () => {
		let commentId = '123456789';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/comments/${commentId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'comments:delete',
				commentId,
				'--token=test'
			])
			.it('should delete a comment', ctx => {
				assert.equal(ctx.stderr, `Successfully deleted comment ${commentId}${os.EOL}`);
			});
	});

	describe('comments:create', () => {
		let fileId = '987654321',
			taggedMessage = '@[1357908642:Other User] Looks good!',
			message = 'Hello there!',
			fixture = getFixture('comments/post_comments'),
			yamlOutput = getFixture('output/comments_create_yaml.txt');

		let expectedTaggedBody = {
			item: {
				id: fileId,
				type: 'file'
			},
			tagged_message: taggedMessage
		};

		let expectedBody = {
			item: {
				id: fileId,
				type: 'file'
			},
			message,
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/comments', expectedTaggedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'comments:create',
				fileId,
				`--tagged-message=${taggedMessage}`,
				'--json',
				'--token=test'
			])
			.it('should create a tagged comment on a file (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/comments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'comments:create',
				fileId,
				`--message=${message}`,
				'--json',
				'--token=test'
			])
			.it('should create a comment on a file when message flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/comments', expectedTaggedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'comments:create',
				fileId,
				`--tagged-message=${taggedMessage}`,
				'--token=test'
			])
			.it('should create a tagged comment on a file (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});

	describe('comments:reply', () => {
		let commentId = '5000948880',
			message = 'These tigers are cool!',
			taggedMessage = '@[1357908642:Other User] Looks good!',
			fixture = getFixture('comments/post_comments_reply'),
			yamlOutput = getFixture('output/comments_reply_yaml.txt');

		let expectedBody = {
			item: {
				id: commentId,
				type: 'comment'
			},
			message
		};

		let expectedTaggedBody = {
			item: {
				id: commentId,
				type: 'comment'
			},
			tagged_message: taggedMessage,
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/comments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'comments:reply',
				commentId,
				`--message=${message}`,
				'--json',
				'--token=test'
			])
			.it('should reply to a comment (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/comments', expectedTaggedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'comments:reply',
				commentId,
				`--tagged-message=${taggedMessage}`,
				'--json',
				'--token=test'
			])
			.it('should reply to a comment when tagged message flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/comments', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'comments:reply',
				commentId,
				`--message=${message}`,
				'--token=test'
			])
			.it('should reply to a comment (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});
	});
});
