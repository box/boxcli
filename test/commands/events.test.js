'use strict';
const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const leche = require('leche');

function assertQuery(
	query,
	streamType,
	expectedBeforeDate,
	expectedAfterDate,
	streamPosition
) {
	const beforeDate = new Date(query.created_before);
	const afterDate = new Date(query.created_after);
	return (
		query.stream_type === streamType &&
		((!streamPosition && !query.stream_position) ||
			streamPosition === query.stream_position) &&
		beforeDate.getFullYear() === expectedBeforeDate.getFullYear() &&
		beforeDate.getMonth() === expectedBeforeDate.getMonth() &&
		beforeDate.getDay() === expectedBeforeDate.getDay() &&
		afterDate.getFullYear() === expectedAfterDate.getFullYear() &&
		afterDate.getMonth() === expectedAfterDate.getMonth() &&
		afterDate.getDay() === expectedAfterDate.getDay()
	);
}

function minusDays(date, daysToSubtract) {
	date.setDate(date.getDate() - daysToSubtract);
	return date;
}

describe('Events', function () {
	const createdBefore = '2014-05-17T13:35:01+00:00';
	const createdAfter = '2015-05-15T13:35:01+00:00';
	const eventType = 'NEW_USER,DELETE_USER,EDIT_USER';
	const streamPosition = '122333';
	const fixture = getFixture('events/get_events');
	const fixture2 = getFixture('events/get_events_second_page');
	const endFixture = getFixture('events/get_events_end');
	const jsonOutput = getFixture('output/events_get_json.txt');

	describe('For admin_logs stream type', function () {
		leche.withData(['events', 'events:get'], function (command) {
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
						stream_position:
							JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
						stream_position:
							JSON.parse(fixture2).next_stream_position,
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
					'--token=test',
				])
				.it(
					'should get events with enterprise, created-before, created-after and event-types flags passed (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
						stream_position:
							JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: createdBefore,
						created_after: createdAfter,
						event_type: eventType,
						stream_type: 'admin_logs',
						stream_position:
							JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
			)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--stream-type=admin_logs',
					`--created-before=${createdBefore}`,
					`--created-after=${createdAfter}`,
					`--event-types=${eventType}`,
					'--json',
					'--token=test',
				])
				.it(
					'should get events with enterprise, streamType, created-before, created-after and event-types flags passed (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
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
					'--token=test',
				])
				.it(
					'should get user events from given stream position when --stream-position flag is passed',
					(context) => {
						assert.equal(context.stdout, fixture);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query({
						limit: '10',
					})
					.reply(200, fixture)
			)
				.stdout()
				.command([command, '--limit=10', '--json', '--token=test'])
				.it(
					'should get user events when neither --stream-position nor --enterprise flags are passed',
					(context) => {
						assert.equal(context.stdout, fixture);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query((query) =>
						assertQuery(
							query,
							'admin_logs',
							new Date(),
							minusDays(new Date(), 5),
							null
						)
					)
					.reply(200, fixture)
					.get('/2.0/events')
					.query((query) =>
						assertQuery(
							query,
							'admin_logs',
							new Date(),
							minusDays(new Date(), 5),
							JSON.parse(fixture).next_stream_position
						)
					)
					.reply(200, fixture2)
					.get('/2.0/events')
					.query((query) =>
						assertQuery(
							query,
							'admin_logs',
							new Date(),
							minusDays(new Date(), 5),
							JSON.parse(fixture2).next_stream_position
						)
					)
					.reply(200, endFixture)
			)
				.stdout()
				.command([command, '--enterprise', '--json', '--token=test'])
				.it(
					'should use default time window when no time bound flags are passed',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query({
						created_before: '2019-02-11T12:34:56+00:00',
						created_after: '2019-02-06T12:34:56+00:00',
						stream_type: 'admin_logs',
					})
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						created_before: '2019-02-11T12:34:56+00:00',
						created_after: '2019-02-06T12:34:56+00:00',
						stream_type: 'admin_logs',
						stream_position:
							JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						created_before: '2019-02-11T12:34:56+00:00',
						created_after: '2019-02-06T12:34:56+00:00',
						stream_type: 'admin_logs',
						stream_position:
							JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
			)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--created-before=2019-02-11T12:34:56+00:00',
					'--json',
					'--token=test',
				])
				.it(
					'should set start time to five days before end time when only end time is passed',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query((query) =>
						assertQuery(
							query,
							'admin_logs',
							new Date(),
							new Date('2018-01-01T12:34:56+00:00')
						)
					)
					.reply(200, fixture)
					.get('/2.0/events')
					.query((query) =>
						assertQuery(
							query,
							'admin_logs',
							new Date(),
							new Date('2018-01-01T12:34:56+00:00'),
							JSON.parse(fixture).next_stream_position
						)
					)
					.reply(200, fixture2)
					.get('/2.0/events')
					.query((query) =>
						assertQuery(
							query,
							'admin_logs',
							new Date(),
							new Date('2018-01-01T12:34:56+00:00'),
							JSON.parse(fixture2).next_stream_position
						)
					)
					.reply(200, endFixture)
			)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--created-after=2018-01-01T12:34:56+00:00',
					'--json',
					'--token=test',
				])
				.it(
					'should set end time to now when only start time is passed',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
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

	describe('For admin_logs_streaming stream type', function () {
		leche.withData(['events', 'events:get'], function (command) {
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query(
						(query) =>
							!query.stream_position &&
							query.event_type === eventType &&
							query.stream_type === 'admin_logs_streaming'
					)
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						event_type: eventType,
						stream_type: 'admin_logs_streaming',
						stream_position:
							JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						event_type: eventType,
						stream_type: 'admin_logs_streaming',
						stream_position:
							JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
			)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--stream-type=admin_logs_streaming',
					`--event-types=${eventType}`,
					'--json',
					'--token=test',
				])
				.it(
					'should get events with enterprise, event-types flags passed (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query(
						(query) =>
							!query.stream_position &&
							query.event_type === eventType &&
							query.stream_type === 'admin_logs_streaming'
					)
					.reply(200, fixture)
					.get('/2.0/events')
					.query({
						event_type: eventType,
						stream_type: 'admin_logs_streaming',
						stream_position:
							JSON.parse(fixture).next_stream_position,
					})
					.reply(200, fixture2)
					.get('/2.0/events')
					.query({
						event_type: eventType,
						stream_type: 'admin_logs_streaming',
						stream_position:
							JSON.parse(fixture2).next_stream_position,
					})
					.reply(200, endFixture)
			)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--stream-type=admin_logs_streaming',
					`--event-types=${eventType}`,
					`--created-before=${createdBefore}`,
					`--created-after=${createdAfter}`,
					'--json',
					'--token=test',
				])
				.it(
					'should should ignore created-xxx flags (JSON Output)',
					(context) => {
						assert.equal(context.stdout, jsonOutput);
					}
				);
			test.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/events')
					.query({
						stream_type: 'admin_logs_streaming',
						stream_position: streamPosition,
						limit: '10',
					})
					.reply(200, fixture)
			)
				.stdout()
				.command([
					command,
					'--enterprise',
					'--stream-type=admin_logs_streaming',
					`--stream-position=${streamPosition}`,
					'--limit=10',
					'--json',
					'--token=test',
				])
				.it(
					'should get user events from given stream position when --stream-position flag is passed',
					(context) => {
						assert.equal(context.stdout, fixture);
					}
				);
		});
	});
});
