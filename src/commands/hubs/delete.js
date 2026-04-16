'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class HubsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsDeleteCommand);
		await this.tsClient.hubs.deleteHubByIdV2025R0(args.id);
		this.info(`Deleted hub ${args.id}`);
	}
}

HubsDeleteCommand.description = 'Delete a Box Hub';
HubsDeleteCommand.examples = ['box hubs:delete 12345'];
HubsDeleteCommand._endpoint = 'delete_hubs_id';

HubsDeleteCommand.flags = {
	...BoxCommand.flags,
};

HubsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub to delete',
	}),
};

module.exports = HubsDeleteCommand;
