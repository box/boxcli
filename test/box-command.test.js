
'use strict';

const assert = require('chai').assert;
const BoxCommand = require('../src/box-command');
const sinon = require('sinon');
const leche = require('leche');
const { test } = require('@oclif/test');
const os = require('os');
const debug = require('debug');
const { TEST_API_ROOT } = require('./helpers/test-helper');

describe('BoxCommand', () => {

	let sandbox = sinon.createSandbox();

	let boxCommand;

	afterEach(() => {
		sandbox.verifyAndRestore();
	});

	describe('Command', () => {

		test
			.stdout()
			.stderr()
			.command([
				'help',
				'--verbose'
			])
			.it('should enable framework debugging when verbose flag is passed', ctx => {
				debug.disable();
				let debugLines = ctx.stderr.split(os.EOL);
				assert.include(debugLines[0], 'box:box-cli:hooks:init');
				assert.include(debugLines[1], 'box:help');
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/users/me')
				.matchHeader('X-Box-UA', /client=box-cli\/\d+\.\d+\.\d+/u)
				.matchHeader('User-Agent', /^Box CLI v\d+\.\d+\.\d+$/u)
				.reply(200, {})
			)
			.stdout()
			.stderr()
			.command([
				'users:get',
				'me',
				'--token=test'
			])
			.it('should send correct analytics and identification headers with API requests');
	});

	describe.skip('getDateFromString()', () => {

		beforeEach(() => {
			// Start clocks at 2018-07-13T12:00:00-08:00 for all tests
			sandbox.useFakeTimers(1531508400000);
			boxCommand = new BoxCommand();
		});

		leche.withData({
			'now shorthand': [
				'now',
				'2018-07-13T12:00:00-07:00'
			],
			'zero seconds shorthand': [
				'0s',
				'2018-07-13T12:00:00-07:00'
			],
			'zero minutes shorthand': [
				'0m',
				'2018-07-13T12:00:00-07:00'
			],
			'zero hours shorthand': [
				'0h',
				'2018-07-13T12:00:00-07:00'
			],
			'zero days shorthand': [
				'0d',
				'2018-07-13T12:00:00-07:00'
			],
			'zero weeks shorthand': [
				'0w',
				'2018-07-13T12:00:00-07:00'
			],
			'zero months shorthand': [
				'0M',
				'2018-07-13T12:00:00-07:00'
			],
			'zero years shorthand': [
				'0y',
				'2018-07-13T12:00:00-07:00'
			],
			'adding one second': [
				'1s',
				'2018-07-13T12:00:01-07:00'
			],
			'adding one minute': [
				'1m',
				'2018-07-13T12:01:00-07:00'
			],
			'adding one hour': [
				'1h',
				'2018-07-13T13:00:00-07:00'
			],
			'adding one day': [
				'1d',
				'2018-07-14T12:00:00-07:00'
			],
			'adding one week': [
				'1w',
				'2018-07-20T12:00:00-07:00'
			],
			'adding one month': [
				'1M',
				'2018-08-13T12:00:00-07:00'
			],
			'adding one year': [
				'1y',
				'2019-07-13T12:00:00-07:00'
			],
			'subtracting one second': [
				'-1s',
				'2018-07-13T11:59:59-07:00'
			],
			'subtracting one minute': [
				'-1m',
				'2018-07-13T11:59:00-07:00'
			],
			'subtracting one hour': [
				'-1h',
				'2018-07-13T11:00:00-07:00'
			],
			'subtracting one day': [
				'-1d',
				'2018-07-12T12:00:00-07:00'
			],
			'subtracting one week': [
				'-1w',
				'2018-07-06T12:00:00-07:00'
			],
			'subtracting one month': [
				'-1M',
				'2018-06-13T12:00:00-07:00'
			],
			'subtracting one year': [
				'-1y',
				'2017-07-13T12:00:00-07:00'
			],
			'adding time across time zone change': [
				'4M',
				'2018-11-13T12:00:00-08:00'
			],
			'subtracting time across time zone change': [
				'-5M',
				'2018-02-13T12:00:00-08:00'
			],
			'exact time': [
				'2018-01-01T00:00:00-08:00',
				'2018-01-01T00:00:00-08:00'
			],
			'exact time in different timezone': [
				'2018-01-01T02:00:00-06:00',
				'2018-01-01T00:00:00-08:00'
			],
			'exact time with Z offset': [
				'2018-01-01T08:00:00Z',
				'2018-01-01T00:00:00-08:00'
			],
			'date only': [
				'2018-07-01',
				'2018-07-01T00:00:00-07:00'
			],
			'timestamp string': [
				'1535336043',
				'2018-08-26T19:14:03-07:00'
			],
			'a combination of positive offset shorthands': [
				'1d30s13h',
				'2018-07-15T01:00:30-07:00'
			],
			'a combination of negative offset shorthands': [
				'-1y5M30s13h',
				'2017-02-12T22:59:30-08:00'
			]
		}, function(input, expectedOutput) {

			it('should return the full RFC3339 timestamp for the given time', function() {

				let dateTime = boxCommand.getDateFromString(input);
				assert.equal(dateTime, expectedOutput);
			});
		});

	});

});
