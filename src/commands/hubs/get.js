'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class HubsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsGetCommand);
		let hub = await this.tsClient.hubs.getHubByIdV2025R0(args.id);
		delete hub.rawData;
		await this.output(hub);
	}
}

HubsGetCommand.description = 'Get details for a Box Hub';
HubsGetCommand.examples = ['box hubs:get 12345'];
HubsGetCommand._endpoint = 'get_hubs_id';

HubsGetCommand.flags = {
	...BoxCommand.flags,
};

HubsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsGetCommand;
