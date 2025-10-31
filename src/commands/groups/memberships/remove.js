'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class GroupsRemoveMembershipCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(GroupsRemoveMembershipCommand);

		await this.client.groups.removeMembership(args.id);
		this.info(`Removed membership ${args.id}`);
	}
}

GroupsRemoveMembershipCommand.aliases = ['groups:membership:remove'];

GroupsRemoveMembershipCommand.description = 'Remove a user from a group';
GroupsRemoveMembershipCommand.examples = [
	'box groups:memberships:remove 12345',
];
GroupsRemoveMembershipCommand._endpoint = 'delete_group_memberships_id';

GroupsRemoveMembershipCommand.flags = {
	...BoxCommand.flags,
};

GroupsRemoveMembershipCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group membership record to delete',
	}),
};

module.exports = GroupsRemoveMembershipCommand;
