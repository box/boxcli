'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class HubsDeleteCollaborationCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsDeleteCollaborationCommand);
		await this.tsClient.hubCollaborations.deleteHubCollaborationByIdV2025R0(
			args.id
		);
		this.info(`Deleted hub collaboration ${args.id}`);
	}
}

HubsDeleteCollaborationCommand.description = 'Delete a single Box Hub collaboration';
HubsDeleteCollaborationCommand.examples = [
	'box hubs:collaborations:delete 99999',
];
HubsDeleteCollaborationCommand._endpoint = 'delete_hub_collaborations_id';

HubsDeleteCollaborationCommand.flags = {
	...BoxCommand.flags,
};

HubsDeleteCollaborationCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the hub collaboration to delete',
	}),
};

module.exports = HubsDeleteCollaborationCommand;
