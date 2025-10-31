'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const pEvent = require('p-event');

class EventsPollCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(EventsPollCommand);
		let stream;
		let options = {};

		if (flags['event-types']) {
			options.event_type = flags['event-types'];
		}
		if (flags['start-date']) {
			options.startDate = flags['start-date'];
		}
		if (flags['end-date']) {
			options.endDate = flags['end-date'];
		}
		if (flags['polling-interval']) {
			if (flags.enterprise) {
				options.pollingInterval = flags['polling-interval'];
			} else {
				options.fetchInterval = flags['polling-interval'] * 1000;
			}
		}

		await this.output('Polling started...');
		if (flags.enterprise) {
			stream = await this.client.events.getEnterpriseEventStream(options);
		} else {
			stream = await this.client.events.getEventStream(options);
		}

		let events = pEvent.iterator(stream, 'data');

		for await (let event of events) {
			await this.output(event);
			await this.output('**************************');
		}
	}
}

EventsPollCommand.description = 'Poll the event stream';

EventsPollCommand.flags = {
	...BoxCommand.flags,
	enterprise: Flags.boolean({
		char: 'e',
		description: 'Get enterprise events',
	}),
	'event-types': Flags.string({
		description:
			'Return enterprise events filtered by event types. Format using a comma delimited list: NEW_USER,DELETE_USER,EDIT_USER',
	}),
	'start-date': Flags.string({
		description:
			'Return enterprise events that occured after this time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks. If not used, defaults to now',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'end-date': Flags.string({
		description:
			'Return enterprise events that occured before this time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks.',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'polling-interval': Flags.string({
		description:
			'Number of seconds to wait before polling for new events. Default is 60 seconds.',
		parse: (input) => parseInt(input, 10),
	}),
};

module.exports = EventsPollCommand;
