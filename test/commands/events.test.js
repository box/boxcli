'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const leche = require('leche');

describe('Events', () => {

	leche.withData([
		'events',
		'events:get'
	], function(command) {

		describe(command, () => {
			let createdBefore = '2014-05-17T13:35:01-00:00',
				createdAfter = '2015-05-15T13:35:01-00:00',
				eventType = 'NEW_USER,DELETE_USER,EDIT_USER',
				streamPosition = '122333',
				fixture = getFixture('events/get_events'),
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
					assert.equal(ctx.stdout, jsonOutput);
				});

			// @TODO(2018-08-20): Add test for default created_before and created_after values

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
