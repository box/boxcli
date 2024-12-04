'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const {
	getFixture,
	TEST_API_ROOT,
	getBulkProgressBar,
} = require('../helpers/test-helper');
const leche = require('leche');
const os = require('os');
const path = require('path');

describe('Search', () => {
	let query = 'Test',
		bulkInputFilePath = path.join(
			__dirname,
			'../fixtures/search/bulk/bulk_get_search_query_input.csv'
		),
		fixture = getFixture('search/get_search_query_page_1'),
		fixture2 = getFixture('search/get_search_query_page_2'),
		jsonOutput = getFixture('output/search_json.txt'),
		jsonOutputLimitedTo5 = getFixture('output/search_json_limit_5.txt');

	describe('search', () => {
		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						query,
						limit: 100,
					})
					.reply(200, fixture)
					.get('/2.0/search')
					.query({
						query,
						limit: 100,
						offset: 5,
					})
					.reply(200, fixture2)
			)
			.stdout()
			.command(['search', query, '--json', '--token=test'])
			.it('should search with query (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						query,
						fields: 'name',
						limit: 100,
					})
					.reply(200, fixture)
					.get('/2.0/search')
					.query({
						query,
						fields: 'name',
						limit: 100,
						offset: 5,
					})
					.reply(200, fixture2)
			)
			.stdout()
			.command(['search', query, '--fields=name', '--json', '--token=test'])
			.it('should send fields param to the API when --fields flag is passed');

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						limit: 100,
						query: '',
						mdfilters:
							'[{"scope":"enterprise","templateKey":"marketingCollateral","filters":{"key":"value"}}]',
					})
					.reply(200, fixture)
					.get('/2.0/search')
					.query({
						mdfilters:
							'[{"scope":"enterprise","templateKey":"marketingCollateral","filters":{"key":"value"}}]',
						limit: 100,
						query: '',
						offset: 5,
					})
					.reply(200, fixture2)
			)
			.stdout()
			.command([
				'search',
				'--md-filter-scope=enterprise',
				'--md-filter-template-key=marketingCollateral',
				'--md-filter-json={"key":"value"}',
				'--json',
				'--token=test',
			])
			.it(
				'should search for files and folders in your Enterprise with NO QUERY and md-filter-scope, md-filter-template-key, md-filter-json flags passed (JSON Output)',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutput);
				}
			);

		leche.withData(
			{
				'scope flag set to user content': [
					['--scope=user_content'],
					{ scope: 'user_content' },
				],
				'scope flag set to enterprise content': [
					['--scope=enterprise_content'],
					{ scope: 'enterprise_content' },
				],
				'type flag set to file': [['--type=file'], { type: 'file' }],
				'type flag set to folder': [['--type=folder'], { type: 'folder' }],
				'file extensions flag with one extension': [
					['--file-extensions=pdf'],
					{ file_extensions: 'pdf' },
				],
				'file extensions flags set to multiple extensions': [
					['--file-extensions=doc,docx,xls'],
					{ file_extensions: 'doc,docx,xls' },
				],
				'content types flag set to one type': [
					['--content-types=name'],
					{ content_types: 'name' },
				],
				'content types flag set to multiple content types': [
					['--content-types=name,description'],
					{ content_types: 'name,description' },
				],
				'ancestor folder IDs flag': [
					['--ancestor-folder-ids=123,456,789'],
					{ ancestor_folder_ids: '123,456,789' },
				],
				'owner user IDs flag': [
					['--owner-user-ids=987,654,321'],
					{ owner_user_ids: '987,654,321' },
				],
				'trash content flag set to trash': [
					['--trash-content=trashed_only'],
					{ trash_content: 'trashed_only' },
				],
				'trash content flag set to non-trash': [
					['--trash-content=non_trashed_only'],
					{ trash_content: 'non_trashed_only' },
				],
				'size from flag': [['--size-from=150'], { size_range: '150,' }],
				'size to flag': [['--size-to=1024'], { size_range: ',1024' }],
				'size from and size to flags': [
					['--size-from=1024', '--size-to=4096'],
					{ size_range: '1024,4096' },
				],
				'created and updated timestamp flags': [
					[
						'--created-at-from=2018-01-01T00:00:00+00:00',
						'--created-at-to=2018-12-31T23:59:59+00:00',
						'--updated-at-from=2019-01-01T00:00:00+00:00',
						'--updated-at-to=2019-12-31T23:59:59+00:00',
					],
					{
						created_at_range:
							'2018-01-01T00:00:00+00:00,2018-12-31T23:59:59+00:00',
						updated_at_range:
							'2019-01-01T00:00:00+00:00,2019-12-31T23:59:59+00:00',
					},
				],
				'sort order flags': [
					['--sort=modified_at', '--direction=asc'],
					{
						sort: 'modified_at',
						direction: 'asc',
					},
				],
				'multitple metadata filters': [
					[
						'--md-filter-scope=global',
						'--md-filter-template-key=properties',
						'--md-filter-json={"foo":"bar"}',
						'--md-filter-scope=enterprise',
						'--md-filter-template-key=myTemplate',
						'--md-filter-json={"baz":"quux"}',
					],
					{
						mdfilters: JSON.stringify([
							{
								scope: 'global',
								templateKey: 'properties',
								filters: {
									foo: 'bar',
								},
							},
							{
								scope: 'enterprise',
								templateKey: 'myTemplate',
								filters: {
									baz: 'quux',
								},
							},
						]),
					},
				],
				'mdfilter flag': [
					['--mdfilter=global.properties.foo=bar'],
					{
						mdfilters: JSON.stringify([
							{
								scope: 'global',
								templateKey: 'properties',
								filters: {
									foo: 'bar',
								},
							},
						]),
					},
				],
				'Classification metadata filter': [
					[
						'--mdfilter=enterprise.securityClassification-6VMVochwUWo.Box__Security__Classification__Key=Public',
					],
					{
						mdfilters: JSON.stringify([
							{
								scope: 'enterprise',
								templateKey: 'securityClassification-6VMVochwUWo',
								filters: {
									Box__Security__Classification__Key: 'Public',
								},
							},
						]),
					},
				],
				'multiple mdfilter flags': [
					[
						'--mdfilter=global.properties.foo=barf',
						'--mdfilter=global.properties.money=3.51f',
						'--mdfilter=enterprise.myTemplate.baz=quux',
						'--mdfilter=enterprise.myTemplate.num>123f',
						'--mdfilter=enterprise.myTemplate.date<2020-01-01T00:00:00Z',
					],
					{
						mdfilters: JSON.stringify([
							{
								scope: 'global',
								templateKey: 'properties',
								filters: {
									foo: 'barf',
									money: {
										lt: 3.51,
										gt: 3.51,
									},
								},
							},
							{
								scope: 'enterprise',
								templateKey: 'myTemplate',
								filters: {
									baz: 'quux',
									num: {
										gt: 123,
									},
									date: {
										lt: '2020-01-01T00:00:00Z',
									},
								},
							},
						]),
					},
				],
				'include recent shared links flag': [
					['--include-recent-shared-links'],
					{ include_recent_shared_links: true },
				],
			},
			function(flags, params) {
				test
					.nock(TEST_API_ROOT, (api) =>
						api
							.get('/2.0/search')
							.query({
								query,
								limit: 100,
								...params,
							})
							.reply(200, fixture)
							.get('/2.0/search')
							.query({
								query,
								...params,
								limit: 100,
								offset: 5,
							})
							.reply(200, fixture2)
					)
					.stdout()
					.command(['search', query, ...flags, '--json', '--token=test'])
					.it('should send search params when flag is passed', (ctx) => {
						assert.equal(ctx.stdout, jsonOutput);
					});
			}
		);

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						query,
						limit: 1000,
					})
					.reply(200, fixture)
					.get('/2.0/search')
					.query({
						query,
						limit: 1000,
						offset: 5,
					})
					.reply(200, fixture2)
			)
			.stdout()
			.command(['search', query, '--json', '--all', '--token=test'])
			.it('should return all results when --all flag provided', (ctx) => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						query,
						limit: 5,
					})
					.reply(200, fixture)
			)
			.stdout()
			.command(['search', query, '--json', '--limit=5', '--token=test'])
			.it('should return limited results when --limit flag provided', (ctx) => {
				assert.equal(ctx.stdout, jsonOutputLimitedTo5);
			});

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						query,
						limit: 5,
					})
					.reply(200, fixture)
			)
			.stdout()
			.command(['search', query, '--json', '--max-items=5', '--token=test'])
			.it(
				'should return same limited results when --max-items flag provided instead of --limit',
				(ctx) => {
					assert.equal(ctx.stdout, jsonOutputLimitedTo5);
				}
			);
	});
	describe('bulk', () => {
		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/search')
					.query({
						limit: 100,
						query: '',
						scope: 'enterprise_content',
						type: 'file',
					})
					.reply(200, { entries: [] })
					.get('/2.0/search')
					.query({
						limit: 100,
						query: '',
						scope: 'enterprise_content',
						type: 'folder',
					})
					.reply(200, { entries: [] })
			)
			.stdout()
			.stderr()
			.command([
				'search',
				`--bulk-file-path=${bulkInputFilePath}`,
				'--json',
				'--token=test',
			])
			.it(
				'should make a successful search call for each entry in a bulk file',
				(ctx) => {
					let expectedMessage = getBulkProgressBar(2);
					expectedMessage += `All bulk input entries processed successfully.${os.EOL}`;
					assert.equal(ctx.stderr, expectedMessage);
				}
			);
	});
	describe('fails', () => {
		test
			.stderr()
			.command(['search', query, '--limit=80', '--all', '--token=test'])
			.it('when both --all and --limit flag provided', (ctx) => {
				assert.include(
					ctx.stderr,
					'--all and --limit(--max-items) flags cannot be used together.'
				);
			});
	});
});
