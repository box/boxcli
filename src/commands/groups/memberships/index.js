'use strict';

const BoxCommand = require('../../../box-command');

class GroupsListMembershipCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsListMembershipCommand);

		let members = await this.client.groups.getMemberships(args.id);
		await this.output(members);
	}
}

GroupsListMembershipCommand.aliases = [ 'groups:membership:list' ];

GroupsListMembershipCommand.description = 'List members of a group';

GroupsListMembershipCommand.flags = {
	...BoxCommand.flags
};

GroupsListMembershipCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to get memberships for',
	}
];

module.exports = GroupsListMembershipCommand;
