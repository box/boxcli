'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

const HUB_COLLABORATION_ROLES = ['editor', 'viewer', 'co-owner'];

class HubsUpdateCollaborationCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsUpdateCollaborationCommand);
		const collaboration =
			await this.tsClient.hubCollaborations.updateHubCollaborationByIdV2025R0(
				args.id,
				{
					role: flags.role,
				}
			);
		await this.output(collaboration.rawData ?? collaboration);
	}
}

HubsUpdateCollaborationCommand.description = 'Updates a Box Hub collaboration. Can be used to change the Box Hub role.';
HubsUpdateCollaborationCommand.examples = [
	'box hubs:collaborations:update 99999 --role viewer',
];
HubsUpdateCollaborationCommand._endpoint = 'put_hub_collaborations_id';

HubsUpdateCollaborationCommand.flags = {
	...BoxCommand.flags,
	role: Flags.string({
		char: 'r',
		description:
			'Updated role for the hub collaboration. One of: editor, viewer, co-owner',
		required: true,
		options: HUB_COLLABORATION_ROLES,
	}),
};

HubsUpdateCollaborationCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the hub collaboration to update',
	}),
};

module.exports = HubsUpdateCollaborationCommand;
