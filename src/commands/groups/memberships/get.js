'use strict';

const BoxCommand = require('../../../box-command');

class GroupsGetMembershipCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(GroupsGetMembershipCommand);
		const { args } = this.parse(GroupsGetMembershipCommand);

		let membership = await this.client.groups.getMembership(args.id);
		await this.output(membership);
	}
}

GroupsGetMembershipCommand.aliases = [ 'groups:membership:get' ];

GroupsGetMembershipCommand.description = 'Get information about a group membership';

GroupsGetMembershipCommand.flags = {
	...BoxCommand.flags
};

GroupsGetMembershipCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group membership to get',
	}
];

module.exports = GroupsGetMembershipCommand;
