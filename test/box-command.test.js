'use strict';

const { assert } = require('chai');
const BoxCommand = require('../src/box-command');
const sinon = require('sinon');
const leche = require('leche');
const { test } = require('@oclif/test');
const debug = require('debug');
const { TEST_API_ROOT, isWin } = require('./helpers/test-helper');

describe('BoxCommand', () => {
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.verifyAndRestore();
	});

	describe('Command', () => {
		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/users/me').reply(200, {})
		)
			.stdout()
			.stderr()
			.command(['users:get', 'me', '--token=test', '--verbose'])
			.it(
				'should enable framework debugging when verbose flag is passed',
				(ctx) => {
					debug.disable();
					const debugLines = ctx.stderr.split('\n');
					assert.include(debugLines[0], 'box:@box/cli:hooks:init');
					assert.include(debugLines[1], 'box-cli:init');
				}
			)
			.timeout(10000);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/users/me')
				.matchHeader('X-Box-UA', /client=box-cli\/\d+\.\d+\.\d+/u)
				.matchHeader('User-Agent', /^Box CLI v\d+\.\d+\.\d+$/u)
				.reply(200, {})
		)
			.stdout()
			.stderr()
			.command(['users:get', 'me', '--token=test'])
			.it(
				'should send correct analytics and identification headers with API requests'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api.post('/2.0/collaborations').reply(200, {})
		)
			.stderr()
			.command([
				'folders:collaborations:add',
				'0',
				'--previewer',
				'--token=test',
				'--save',
			])
			.it(
				'should save output to file named with valid characters',
				(ctx) => {
					assert.include(ctx.stderr, 'folders-collaborations-add');
					const stderr = isWin()
						? ctx.stderr.replace(':', '')
						: ctx.stderr;
					assert.notInclude(stderr, ':');
				}
			);

		describe('As-User', () => {
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/users/me')
					.matchHeader('As-user', '12345')
					.reply(200, {})
			)
				.stdout()
				.stderr()
				.command(['users:get', 'me', '--token=test', '--as-user=12345'])
				.it('should send as-user header when --as-user flag is passed');
		});
	});

	describe('normalizeDateString()', () => {
		beforeEach(() => {
			// Start clocks at 2018-07-13T12:00:00 UTC for all tests
			sandbox.useFakeTimers(1531508400000);
		});

		leche.withData(
			{
				'now shorthand': ['now', '2018-07-13T19:00:00+00:00'],
				'zero seconds shorthand': ['0s', '2018-07-13T19:00:00+00:00'],
				'zero minutes shorthand': ['0m', '2018-07-13T19:00:00+00:00'],
				'zero hours shorthand': ['0h', '2018-07-13T19:00:00+00:00'],
				'zero days shorthand': ['0d', '2018-07-13T19:00:00+00:00'],
				'zero weeks shorthand': ['0w', '2018-07-13T19:00:00+00:00'],
				'zero months shorthand': ['0M', '2018-07-13T19:00:00+00:00'],
				'zero years shorthand': ['0y', '2018-07-13T19:00:00+00:00'],
				'adding one second': ['1s', '2018-07-13T19:00:01+00:00'],
				'adding one minute': ['1m', '2018-07-13T19:01:00+00:00'],
				'adding one hour': ['1h', '2018-07-13T20:00:00+00:00'],
				'adding one day': ['1d', '2018-07-14T19:00:00+00:00'],
				'adding one week': ['1w', '2018-07-20T19:00:00+00:00'],
				'adding one month': ['1M', '2018-08-13T19:00:00+00:00'],
				'adding one year': ['1y', '2019-07-13T19:00:00+00:00'],
				'subtracting one second': ['-1s', '2018-07-13T18:59:59+00:00'],
				'subtracting one minute': ['-1m', '2018-07-13T18:59:00+00:00'],
				'subtracting one hour': ['-1h', '2018-07-13T18:00:00+00:00'],
				'subtracting one day': ['-1d', '2018-07-12T19:00:00+00:00'],
				'subtracting one week': ['-1w', '2018-07-06T19:00:00+00:00'],
				'subtracting one month': ['-1M', '2018-06-13T19:00:00+00:00'],
				'subtracting one year': ['-1y', '2017-07-13T19:00:00+00:00'],
				// 'adding time across time zone change': [
				// 	'4M',
				// 	'2018-11-13T20:00:00+00:00'
				// ],
				// 'subtracting time across time zone change': [
				// 	'-5M',
				// 	'2018-02-13T20:00:00+00:00'
				// ],
				'exact time': [
					'2018-01-01T00:00:00-08:00',
					'2018-01-01T08:00:00+00:00',
				],
				'exact time in different timezone': [
					'2018-01-01T02:00:00-06:00',
					'2018-01-01T08:00:00+00:00',
				],
				'exact time with Z offset': [
					'2018-01-01T08:00:00Z',
					'2018-01-01T08:00:00+00:00',
				],
				'exact time with UTC offset': [
					'2018-01-01T08:00:00+00:00',
					'2018-01-01T08:00:00+00:00',
				],
				// 'date only': [
				// 	'2018-07-01',
				// 	'2018-07-01T00:00:00+00:00'
				// ],
				'timestamp string': ['1535336043', '2018-08-27T02:14:03+00:00'],
				'a combination of positive offset shorthands': [
					'1d30s13h',
					'2018-07-15T08:00:30+00:00',
				],
				// 'a combination of negative offset shorthands': [
				// 	'-1y5M30s13h',
				// 	'2017-02-13T05:59:30+00:00'
				// ]
			},
			function (input, expectedOutput) {
				it('should return the full RFC3339 timestamp for the given time', function () {
					let dateTime = BoxCommand.normalizeDateString(input);
					assert.equal(dateTime, expectedOutput);
				});
			}
		);
	});
});
