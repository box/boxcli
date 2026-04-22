'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utilities = require('../../util');

class HubsCopyCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsCopyCommand);
		const requestBody = {};

		if (flags.title) {
			requestBody.title = flags.title;
		}
		if (flags.description) {
			requestBody.description = flags.description;
		}

		const hub = await this.tsClient.hubs.copyHubV2025R0(args.id, requestBody);
		await this.output(hub.rawData ?? hub);
	}
}

HubsCopyCommand.description = 'Copy a Box Hub';
HubsCopyCommand.examples = [
	'box hubs:copy 12345 --title "Copied hub title" --description "Copied hub description"',
];
HubsCopyCommand._endpoint = 'post_hubs_id_copy';

HubsCopyCommand.flags = {
	...BoxCommand.flags,
	title: Flags.string({
		char: 'T',
		description: 'Optional title override for the copied hub',
	}),
	description: Flags.string({
		char: 'd',
		description: 'Optional description override for the copied hub',
		parse: utilities.unescapeSlashes,
	}),
};

HubsCopyCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub to copy',
	}),
};

module.exports = HubsCopyCommand;
