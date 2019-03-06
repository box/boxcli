'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class EventsPollCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(EventsPollCommand);
		let stream;
		let options = {};

		if (flags['event-types']) {
			options.event_type = flags['event-types'];
		}
		if (flags['start-date']) {
			options.startDate = this.getDateFromString(flags['start-date']);
		}
		if (flags['end-date']) {
			options.endDate = this.getDateFromString(flags['end-date']);
		}
		if (flags['polling-interval']) {
			options.pollingInterval = flags['polling-interval'];
		}

		await this.output('Polling started...');
		if (flags.enterprise) {
			stream = await this.client.events.getEnterpriseEventStream(options);
		} else {
			stream = await this.client.events.getEventStream(options);
		}
		stream.on('data', async event => {
			await this.output(event);
			await this.output('***********************');
		});

	}
}

EventsPollCommand.description = 'Poll the event stream';

EventsPollCommand.flags = {
	...BoxCommand.flags,
	enterprise: flags.boolean({
		char: 'e',
		description: 'Get enterprise events'
	}),
	'event-types': flags.string({ description: 'Return enterprise events filtered by event types. Format using a comma delimited list: NEW_USER,DELETE_USER,EDIT_USER' }),
	'start-date': flags.string({ description: 'Return enterprise events that occured after this time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks. If not used, defaults to now' }),
	'end-date': flags.string({ description: 'Return enterprise events that occured before this time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks.' }),
	'polling-interval': flags.string({ description: 'Number of seconds to wait before polling for new events. Default is 60 seconds.' })
};


module.exports = EventsPollCommand;
