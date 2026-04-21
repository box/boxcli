'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

const HUB_COLLABORATION_ROLES = ['editor', 'viewer', 'co-owner'];

function getAccessibleBy(flags) {
	if (flags['user-id']) {
		return {
			type: 'user',
			id: flags['user-id'],
		};
	}

	if (flags['group-id']) {
		return {
			type: 'group',
			id: flags['group-id'],
		};
	}

	if (flags.login) {
		return {
			type: 'user',
			login: flags.login,
		};
	}

	throw new Error('Please provide one of --user-id, --group-id, or --login.');
}

class HubsCreateCollaborationCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsCreateCollaborationCommand);
		const requestBody = {
			hub: {
				id: args.id,
				type: 'hubs',
			},
			accessibleBy: getAccessibleBy(flags),
			role: flags.role,
		};

		const collaboration =
			await this.tsClient.hubCollaborations.createHubCollaborationV2025R0(
				requestBody
			);
		delete collaboration.rawData;
		await this.output(collaboration);
	}
}
HubsCreateCollaborationCommand.aliases = ['hubs:collaborations:add'];
HubsCreateCollaborationCommand.description =
	'Adds a collaboration with a specific role for a single user or a single group to a Box Hub. Collaborations can be created using email address, user IDs, or group IDs';
HubsCreateCollaborationCommand.examples = [
	'box hubs:collaborations:create 12345 --role editor --user-id 22222',
	'box hubs:collaborations:create 12345 --role viewer --group-id 33333',
	'box hubs:collaborations:create 12345 --role co-owner --login jdoe@example.com',
];
HubsCreateCollaborationCommand._endpoint = 'post_hub_collaborations';

HubsCreateCollaborationCommand.flags = {
	...BoxCommand.flags,
	role: Flags.string({
		char: 'r',
		description:
			'Role to grant for the hub collaboration. One of: editor, viewer, co-owner',
		required: true,
		options: HUB_COLLABORATION_ROLES,
	}),
	'user-id': Flags.string({
		description: 'Collaborate a user by Box user ID',
		exclusive: ['group-id', 'login'],
	}),
	'group-id': Flags.string({
		description: 'Collaborate a group by Box group ID',
		exclusive: ['user-id', 'login'],
	}),
	login: Flags.string({
		description: 'Collaborate a user by email address',
		exclusive: ['user-id', 'group-id'],
	}),
};

HubsCreateCollaborationCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsCreateCollaborationCommand;
