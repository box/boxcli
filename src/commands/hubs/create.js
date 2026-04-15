'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utilities = require('../../util');

class HubsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsCreateCommand);
		let requestBody = {
			title: args.title,
		};

		if (flags.description) {
			requestBody.description = flags.description;
		}

		let hub = await this.tsClient.hubs.createHubV2025R0(requestBody);
		delete hub.rawData;
		await this.output(hub);
	}
}

HubsCreateCommand.description = 'Create a new Box Hub';
HubsCreateCommand.examples = ['box hubs:create "Roadmap Hub" --description "Q3 planning hub"'];
HubsCreateCommand._endpoint = 'post_hubs';

HubsCreateCommand.flags = {
	...BoxCommand.flags,
	description: Flags.string({
		char: 'd',
		description: 'Description of the Box Hub',
		parse: utilities.unescapeSlashes,
	}),
};

HubsCreateCommand.args = {
	title: Args.string({
		name: 'title',
		required: true,
		hidden: false,
		description: 'Title for the Box Hub',
	}),
};

module.exports = HubsCreateCommand;
