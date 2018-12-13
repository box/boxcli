'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class EventsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(EventsGetCommand);
		let options = {};

		if (flags.enterprise) {
			options.stream_type = 'admin_logs';
		}
		if (flags['stream-position']) {
			options.stream_position = flags['stream-position'];
		}
		if (flags.limit) {
			options.limit = parseInt(flags.limit, 10);
		}
		if (flags['created-after']) {
			options.created_after = this.getDateFromString(flags['created-after']);
		}
		if (flags['created-before']) {
			options.created_before = this.getDateFromString(flags['created-before']);
		}
		if (flags['event-types']) {
			options.event_type = (flags['event-types']).split(',');
		}

		// Default values for backward compatibility
		if (!options.stream_position && !options.created_before && !options.created_after) {
			options.created_after = this.getDateFromString('-5d');
			options.created_before = this.getDateFromString('0d');
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
		description: 'Return enterprise events that occured after a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to 5 days ago',
	}),
	'created-before': flags.string({
		description: 'Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to now',
	}),
	'event-types': flags.string({ description: 'Return enterprise events filtered by event types. Format using a comma delimited list: NEW_USER,DELETE_USER,EDIT_USER' }),
	'stream-position': flags.string({ description: 'The location in the event stream from which you want to start receiving events' }),
	limit: flags.string({ description: 'The maximum number of items to return' })
};


module.exports = EventsGetCommand;
