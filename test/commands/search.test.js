'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const leche = require('leche');

describe('Search', () => {

	describe('search', () => {
		let query = 'Test',
			fixture = getFixture('search/get_search_query_page_1'),
			fixture2 = getFixture('search/get_search_query_page_2'),
			jsonOutput = getFixture('output/search_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
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
					offset: 5
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'search',
				query,
				'--json',
				'--token=test'
			])
			.it('should search with query (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/search')
				.query({
					limit: 100,
					query: '',
					mdfilters: '[{"scope":"enterprise","templateKey":"marketingCollateral","filters":{"key":"value"}}]',
				})
				.reply(200, fixture)
				.get('/2.0/search')
				.query({
					mdfilters: '[{"scope":"enterprise","templateKey":"marketingCollateral","filters":{"key":"value"}}]',
					limit: 100,
					query: '',
					offset: 5
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
				'--token=test'
			])
			.it('should search for files and folders in your Enterprise with NO QUERY and md-filter-scope, md-filter-template-key, md-filter-json flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		leche.withData({
			'scope flag set to user content': [
				['--scope=user_content'],
				{scope: 'user_content'}
			],
			'scope flag set to enterprise content': [
				['--scope=enterprise_content'],
				{scope: 'enterprise_content'}
			],
			'type flag set to file': [
				['--type=file'],
				{type: 'file'}
			],
			'type flag set to folder': [
				['--type=folder'],
				{type: 'folder'}
			],
			'file extensions flag with one extension': [
				['--file-extensions=pdf'],
				{file_extensions: 'pdf'}
			],
			'file extensions flags set to multiple extensions': [
				['--file-extensions=doc,docx,xls'],
				{file_extensions: 'doc,docx,xls'}
			],
			'content types flag set to one type': [
				['--content-types=name'],
				{content_types: 'name'}
			],
			'content types flag set to multiple content types': [
				['--content-types=name,description'],
				{content_types: 'name,description'}
			],
			'ancestor folder IDs flag': [
				['--ancestor-folder-ids=123,456,789'],
				{ancestor_folder_ids: '123,456,789'}
			],
			'owner user IDs flag': [
				['--owner-user-ids=987,654,321'],
				{owner_user_ids: '987,654,321'}
			],
			'trash content flag set to trash': [
				['--trash-content=trashed_only'],
				{trash_content: 'trashed_only'}
			],
			'trash content flag set to non-trash': [
				['--trash-content=non_trashed_only'],
				{trash_content: 'non_trashed_only'}
			],
			'size from flag': [
				['--size-from=150'],
				{size_range: '150,'}
			],
			'size to flag': [
				['--size-to=1024'],
				{size_range: ',1024'}
			],
			'size from and size to flags': [
				[
					'--size-from=1024',
					'--size-to=4096'
				],
				{size_range: '1024,4096'}
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
					])
				}
			],
			'mdfilter flag': [
				['--mdfilter=global.properties.foo=bar'],
				{
					mdfilters: JSON.stringify([
						{
							scope: 'global',
							templateKey: 'properties',
							filters: {
								foo: 'bar'
							},
						}
					]),
				}
			],
			'Classification metadata filter': [
				['--mdfilter=enterprise.securityClassification-6VMVochwUWo.Box__Security__Classification__Key=Public'],
				{
					mdfilters: JSON.stringify([
						{
							scope: 'enterprise',
							templateKey: 'securityClassification-6VMVochwUWo',
							filters: {
								Box__Security__Classification__Key: 'Public',
							},
						}
					]),
				}
			],
			'multiple mdfilter flags': [
				[
					'--mdfilter=global.properties.foo=barf',
					'--mdfilter=global.properties.money=3.51f',
					'--mdfilter=enterprise.myTemplate.baz=quux',
					'--mdfilter=enterprise.myTemplate.num>123f',
					'--mdfilter=enterprise.myTemplate.date<2020-01-01T00:00:00Z'
				],
				{
					mdfilters: JSON.stringify([
						{
							scope: 'global',
							templateKey: 'properties',
							filters: {
								foo: 'barf',
								money: 3.51,
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
						}
					]),
				}
			]
		}, function(flags, params) {

			test
				.nock(TEST_API_ROOT, api => api
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
						offset: 5
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					'search',
					query,
					...flags,
					'--json',
					'--token=test'
				])
				.it('should send search params when flag is passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});
});
