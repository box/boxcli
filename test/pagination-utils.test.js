'use strict';

const paginationUtils = require('../src/pagination-utils');
const assert = require('chai').assert;
const { test } = require('@oclif/test');
const { getFixture, TEST_API_ROOT } = require('./helpers/test-helper');

describe('Pagination', () => {
	describe('Utilities', () => {
		it('should set limit to flag value', () => {
			let flags = { 'max-items': 42 };
			let options = paginationUtils.handlePagination(flags);
			assert.deepEqual(options, { limit: 42 });
		});

		it('should set limit to maximum value of 1000', () => {
			let flags = { 'max-items': 420000 };
			let options = paginationUtils.handlePagination(flags);
			assert.deepEqual(options, { limit: 1000 });
		});

		it('should throw exception if max-items is equal to 0', () => {
			let flags = { 'max-items': 0 };
			assert.throws(
				() => paginationUtils.handlePagination(flags),
				'Max items must be greater than 0'
			);
		});

		it('should throw exception if max-items is less than 0', () => {
			let flags = { 'max-items': -100 };
			assert.throws(
				() => paginationUtils.handlePagination(flags),
				'Max items must be greater than 0'
			);
		});

		it('should set default limit to 1000', () => {
			let flags = {};
			let options = paginationUtils.handlePagination(flags);
			assert.deepEqual(options, { limit: 1000 });
		});

		it('should set usemarker to true', () => {
			let flags = {};
			let options = paginationUtils.forceMarkerPagination(flags);
			assert.deepEqual(options, { usemarker: true, limit: 1000 });
		});

		it('flags contain max-items', () => {
			assert.containsAllKeys(paginationUtils.flags, 'max-items');
		});
	});

	describe('Endpoints query parameterers', () => {
		describe('Pagination', () => {
			let fixture = getFixture(
					'pagination/get_files_id_versions_marker.json'
				),
				jsonOutput = getFixture(
					'output/files_versions_list_pagination_json.txt'
				),
				fileId = '1234567890';

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/files/${fileId}/versions`)
					.query({ limit: 2 })
					.reply(200, fixture)
			)
				.stdout()
				.command([
					'files:versions',
					fileId,
					'--token=test',
					'--json',
					'--max-items=2',
				])
				.it(
					'should include max-items as limit and return response',
					(ctx) => {
						assert.equal(ctx.stdout, jsonOutput);
					}
				);
		});

		describe('Forced marker pagination', () => {
			let fixture = getFixture('pagination/get_folders_id_items_marker'),
				jsonOutput = getFixture(
					'output/folders_list_items_pagination_json.txt'
				),
				folderId = '0';

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/folders/${folderId}/items`)
					.query({ usemarker: true, limit: 2 })
					.reply(200, fixture)
			)
				.stdout()
				.command([
					'folders:items',
					folderId,
					'--token=test',
					'--json',
					'--max-items=2',
				])
				.it(
					'should include max-items as limit, usemarker set to true and return response',
					(ctx) => {
						assert.equal(ctx.stdout, jsonOutput);
					}
				);
		});

		describe('Max items', () => {
			let fixture = getFixture(
					'pagination/get_folders_id_items_marker.json'
				),
				oneItemJsonOutput = getFixture(
					'output/folders_list_items_pagination_one_item_json.txt'
				),
				twoItemsJsonOutput = getFixture(
					'output/folders_list_items_pagination_json.txt'
				),
				folderId = '0';

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/folders/${folderId}/items`)
					.query({ usemarker: true, limit: 1 })
					.reply(200, fixture)
			)
				.stdout()
				.command([
					'folders:items',
					folderId,
					'--token=test',
					'--json',
					'--max-items=1',
				])
				.it(
					'should return number of items up to max-items if max-items is smaller than the result length',
					(ctx) => {
						assert.equal(ctx.stdout, oneItemJsonOutput);
					}
				);

			test.nock(TEST_API_ROOT, (api) =>
				api
					.get(`/2.0/folders/${folderId}/items`)
					.query({ usemarker: true, limit: 3 })
					.reply(200, fixture)
			)
				.stdout()
				.command([
					'folders:items',
					folderId,
					'--token=test',
					'--json',
					'--max-items=3',
				])
				.it(
					'should return number of items up to total number of items if max-items is greater than the result length',
					(ctx) => {
						assert.equal(ctx.stdout, twoItemsJsonOutput);
					}
				);
		});
	});
});
