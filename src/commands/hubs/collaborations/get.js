'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class HubsGetCollaborationCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsGetCollaborationCommand);
		const collaboration =
			await this.tsClient.hubCollaborations.getHubCollaborationByIdV2025R0(
				args.id
			);
		await this.output(collaboration.rawData ?? collaboration);
	}
}

HubsGetCollaborationCommand.description =
	'Retrieves details for a Box Hub collaboration by collaboration ID';
HubsGetCollaborationCommand.examples = ['box hubs:collaborations:get 99999'];
HubsGetCollaborationCommand._endpoint = 'get_hub_collaborations_id';

HubsGetCollaborationCommand.flags = {
	...BoxCommand.flags,
};

HubsGetCollaborationCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the hub collaboration',
	}),
};

module.exports = HubsGetCollaborationCommand;
