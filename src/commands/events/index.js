'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const date = require('date-fns');

const DEFAULT_START_TIME = '-5d';
const DEFAULT_END_TIME = 'now';

const eventReplacements = {
	ADMIN_INVITE_ACCEPT: 'MASTER_INVITE_ACCEPT',
	ADMIN_INVITE_REJECT: 'MASTER_INVITE_REJECT',
};

class EventsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(EventsGetCommand);
		let options = {};

		if (flags.enterprise) {
			options.stream_type = flags['stream-type'] || 'admin_logs';
		}
		if (flags.limit) {
			options.limit = flags.limit;
		}
		if (flags['event-types']) {
			const joinedEvents = flags['event-types'];
			const events = joinedEvents.split(',');
			const mappedEvents = events.map(event => {
				const replacement = eventReplacements[event];
				return replacement ? replacement : event;
			});
			options.event_type = mappedEvents.join(',');
		}

		if (flags['stream-position']) {
			options.stream_position = flags['stream-position'];
		} else if (options.stream_type === 'admin_logs') {
			options.created_before = flags['created-before'] || BoxCommand.normalizeDateString(DEFAULT_END_TIME);

			if (flags['created-before'] && !flags['created-after']) {
				// If the user specified an end time but no start time, recompute the default start time as
				// the specified end time minus five days
				let endTime = date.addDays(date.parse(options.created_before), -5);
				options.created_after = endTime.toISOString().replace(/\.\d{3}Z$/u, '+00:00');
			} else {
				options.created_after = flags['created-after'] || BoxCommand.normalizeDateString(DEFAULT_START_TIME);
			}
		}

		let events = await this.client.events.get(options);
		const isNotAdminTypeStream = options.stream_type !== 'admin_logs' && options.stream_type !== 'admin_logs_streaming';
		if (options.stream_position || isNotAdminTypeStream) {
			await this.output(events);
		} else {
			let allEvents = [].concat(events.entries); // Copy the first page of events

			// @NOTE: The Events API doesn't return any of the usual indications that the end of paging has been
			// reached, but does appear to return a "next stream position" that's the same as the one passed in
			while (options.stream_position !== events.next_stream_position) {
				options.stream_position = events.next_stream_position;
				/* eslint-disable no-await-in-loop */
				events = await this.client.events.get(options);
				/* eslint-enable no-await-in-loop */
				events.entries.forEach(event => allEvents.push(event));
			}

			await this.output(allEvents);
		}
	}
}

EventsGetCommand.aliases = [ 'events:get' ];

EventsGetCommand.description = 'Get events';
EventsGetCommand.examples = [
	'box events',
	'box events --enterprise --created-after 2019-01-01'
];
EventsGetCommand._endpoint = 'get_events';

EventsGetCommand.flags = {
	...BoxCommand.flags,
	enterprise: flags.boolean({
		char: 'e',
		description: 'Get all enterprise events form a given criteria.\n' +
		'CLI will use the `next_stream_position` automatically to fetch all records.'
	}),
	'created-after': flags.string({
		description: 'Return enterprise events that occurred after a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to 5 days before the end date',
		exclusive: ['stream_position'],
		dependsOn: ['enterprise'],
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'created-before': flags.string({
		description: 'Return enterprise events that occurred before a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to now',
		exclusive: ['stream_position'],
		dependsOn: ['enterprise'],
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'event-types': flags.string({
		description: 'Return enterprise events filtered by event types. Format using a comma delimited list: NEW_USER,DELETE_USER,EDIT_USER',
	}),
	'stream-position': flags.string({
		description: 'The location in the event stream from which you want to start receiving events',
		exclusive: [
			'created-before',
			'created-after'
		]
	}),
	limit: flags.integer({
		description: 'The maximum number of items to return.\n' +
		'When using it with `enterprise` events, it determines the number of items to return per API call. ' +
		'The CLI will automatically use the `next_stream_position` to fetch all records.'
	}),
	'stream-type': flags.string(
		{
			description: 'Stream type admin_logs or admin_logs_streaming.\n' +
				'Unless specified `admin_logs` stream type is used.\n\n' +
				'The emphasis for `admin_logs` stream is on completeness over latency, which means that Box will ' +
				'deliver admin events in chronological order and without duplicates, but with higher latency. ' +
				'You can specify start and end time/dates.\n\n' +
				'The emphasis for `admin_logs_streaming` feed is on low latency rather than chronological accuracy, ' +
				'which means that Box may return events more than once and out of chronological order. Events are ' +
				'returned via the API around 12 seconds after they are processed by Box (the 12 seconds buffer ' +
				'ensures that new events are not written after your cursor position). Only two weeks of events are ' +
				'available via this feed, and you cannot set start and end time/dates.',
			dependsOn: ['enterprise'],
			options: ['admin_logs', 'admin_logs_streaming']
		}
	)
};


module.exports = EventsGetCommand;
