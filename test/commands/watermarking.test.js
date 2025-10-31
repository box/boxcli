'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const leche = require('leche');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Watermarking', () => {
	describe('watermarking:apply', () => {
		let itemID = '11111',
			fixture = getFixture('watermarking/put_files_id_watermark'),
			yamlOutput = getFixture('output/watermarking_apply_yaml.txt');

		let expectedBody = {
			watermark: {
				imprint: 'default',
			},
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${itemID}/watermark`, expectedBody)
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'watermarking:apply',
				'file',
				itemID,
				'--json',
				'--token=test',
			])
			.it('should apply a watermark on a file (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/files/${itemID}/watermark`, expectedBody)
				.reply(201, fixture)
		)
			.stdout()
			.command(['watermarking:apply', 'file', itemID, '--token=test'])
			.it('should apply a watermark on a file (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/folders/${itemID}/watermark`, expectedBody)
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'watermarking:apply',
				'folder',
				itemID,
				'--json',
				'--token=test',
			])
			.it('should apply a watermark on a folder (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('watermarking:get', () => {
		let itemID = '11111',
			fixture = getFixture('watermarking/get_files_id_watermark'),
			yamlOutput = getFixture('output/watermarking_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${itemID}/watermark`).reply(200, fixture)
		)
			.stdout()
			.command([
				'watermarking:get',
				'file',
				itemID,
				'--json',
				'--token=test',
			])
			.it('should get the watermark on a file (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/files/${itemID}/watermark`).reply(200, fixture)
		)
			.stdout()
			.command(['watermarking:get', 'file', itemID, '--token=test'])
			.it('should get the watermark on a file (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/folders/${itemID}/watermark`).reply(200, fixture)
		)
			.stdout()
			.command([
				'watermarking:get',
				'folder',
				itemID,
				'--json',
				'--token=test',
			])
			.it('should get the watermark on a folder (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('watermarking:remove', () => {
		let itemID = '11111';

		leche.withData(
			{
				'file type': ['file'],
				'folder type': ['folder'],
			},
			function (itemType) {
				test.nock(TEST_API_ROOT, (api) =>
					api
						.delete(`/2.0/${itemType}s/${itemID}/watermark`)
						.reply(204)
				)
					.stdout()
					.stderr()
					.command([
						'watermarking:remove',
						itemType,
						itemID,
						'--token=test',
					])
					.it('should remove a watermark from the item', (ctx) => {
						assert.equal(
							ctx.stderr,
							`Removed watermark for ${itemType} ${itemID}${os.EOL}`
						);
					});
			}
		);
	});
});
