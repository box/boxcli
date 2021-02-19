'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const leche = require('leche');
const sinon = require('sinon');

const sandbox = sinon.createSandbox();

describe('Events', () => {

	beforeEach(() => {
		// Start clocks at 2018-07-13T12:00:00 UTC for all tests
		sandbox.useFakeTimers(1531508400000);
	});

	afterEach(() => {
		sandbox.verifyAndRestore();
	});

	leche.withData([
		'events',
		'events:get'
	], function(command) {

		describe(command, () => {
			let createdBefore = '2014-05-17T13:35:01+00:00',
				createdAfter = '2015-05-15T13:35:01+00:00',
				eventType = 'NEW_USER,DELETE_USER,EDIT_USER',
				streamPosition = '122333',
				fixture = getFixture('events/get_events'),
				fixture2 = getFixture('events/get_events_second_page'),
				endFixture = getFixture('events/get_events_end'),
				jsonOutput = getFixture('output/events_get_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs'
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
				)
				.stdout()
				.command([
					command,
					'--enterprise',
					`--created-before=${createdBefore}`,
					`--created-after=${createdAfter}`,
					`--event-types=${eventType}`,
					'--json',
					'--token=test'
				])
				.it('should get events with enterprise, created-before, created-after and event-types flags passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/events')
					.query({
						stream_position: streamPosition,
						limit: '10',
					})
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					`--stream-position=${streamPosition}`,
					'--limit=10',
					'--json',
					'--token=test'
				])
				.it('should get user events from given stream position when --stream-position flag is passed', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/events')
					.query({
						limit: '10',
					})
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					'--limit=10',
					'--json',
					'--token=test'
				])
				.it('should get user events when neither --stream-position nor --enterprise flags are passed', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/events')
					.query({
						created_before: '2018-07-13T19:00:00+00:00',
						created_after: '2018-07-08T19:00:00+00:00',
						stream_type: 'admin_logs'
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: '2018-07-13T19:00:00+00:00',
						created_after: '2018-07-08T19:00:00+00:00',
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: '2018-07-13T19:00:00+00:00',
						created_after: '2018-07-08T19:00:00+00:00',
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
				)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--json',
					'--token=test'
				])
				.it('should use default time window when no time bound flags are passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/events')
					.query({
						created_before: '2019-02-11T12:34:56+00:00',
						created_after: '2019-02-06T12:34:56+00:00',
						stream_type: 'admin_logs'
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: '2019-02-11T12:34:56+00:00',
						created_after: '2019-02-06T12:34:56+00:00',
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: '2019-02-11T12:34:56+00:00',
						created_after: '2019-02-06T12:34:56+00:00',
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
				)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--created-before=2019-02-11T12:34:56+00:00',
					'--json',
					'--token=test'
				])
				.it('should set start time to five days before end time when only end time is passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/events')
					.query({
						created_before: '2018-07-13T19:00:00+00:00',
						created_after: '2018-01-01T12:34:56+00:00',
						stream_type: 'admin_logs'
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: '2018-07-13T19:00:00+00:00',
						created_after: '2018-01-01T12:34:56+00:00',
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: '2018-07-13T19:00:00+00:00',
						created_after: '2018-01-01T12:34:56+00:00',
						stream_type: 'admin_logs',
						stream_position: JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
				)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--created-after=2018-01-01T12:34:56+00:00',
					'--json',
					'--token=test'
				])
				.it('should set end time to now when only start time is passed', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	//	describe.only('events:poll', () => {
	//		var stream = fs.createReadStream(path.join(__dirname, '..', 'fixtures/test_file.txt'));
	//
	//		test
	//			.nock(TEST_API_ROOT, api => api
	//				.options('/2.0/events')
	//				.query(true)
	//				.reply(200, () => stream)
	//			)
	//			.stdout()
	//			.command([
	//				'events:poll',
	//				'--json'
	//			])
	//			.it('should poll the event stream', ctx => {
	//				//				stream.on('data', function (chunk) {
	//				//					console.log(chunk);
	//				//				});
	//				//				assert.deepEqual(JSON.parse(ctx.stdout), JSON.parse(fixture));
	//			});
	//	});

});
