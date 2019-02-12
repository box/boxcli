'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const date = require('date-fns');

const DEFAULT_START_TIME = '-5d';
const DEFAULT_END_TIME = 'now';

class EventsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(EventsGetCommand);
		let options = {};

		if (flags.enterprise) {
			options.stream_type = 'admin_logs';
		}
		if (flags.limit) {
			options.limit = flags.limit;
		}
		if (flags['event-types']) {
			options.event_type = flags['event-types'];
		}

		if (flags['stream-position']) {
			options.stream_position = flags['stream-position'];
		} else if (options.stream_type === 'admin_logs') {
			options.created_before = this.getDateFromString(flags['created-before'] || DEFAULT_END_TIME);

			if (flags['created-before'] && !flags['created-after']) {
				// If the user specified an end time but no start time, recompute the default start time as
				// the specified end time minus five days
				let endTime = date.addDays(date.parse(options.created_before), -5);
				options.created_after = endTime.toISOString().replace(/\.\d{3}Z$/u, '-00:00');
			} else {
				options.created_after = this.getDateFromString(flags['created-after'] || DEFAULT_START_TIME);
			}
		}

		let events = await this.client.events.get(options);
		await this.output(events);
	}
}

EventsGetCommand.aliases = [ 'events:get' ];

EventsGetCommand.description = 'Get events';

EventsGetCommand.flags = {
	...BoxCommand.flags,
	enterprise: flags.boolean({
		char: 'e',
		description: 'Get enterprise events'
	}),
	'created-after': flags.string({
		description: 'Return enterprise events that occured after a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to 5 days before the end date',
		exclusive: ['stream_position'],
		dependsOn: ['enterprise'],
	}),
	'created-before': flags.string({
		description: 'Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to now',
		exclusive: ['stream_position'],
		dependsOn: ['enterprise'],
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
		description: 'The maximum number of items to return',
	}),
};


module.exports = EventsGetCommand;
