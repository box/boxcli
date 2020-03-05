'use strict';

const BoxCommand = require('../../../box-command');

class GroupsGetMembershipCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsGetMembershipCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let membership = await this.client.groups.getMembership(args.id, options);
		await this.output(membership);
	}
}

GroupsGetMembershipCommand.aliases = [ 'groups:membership:get' ];

GroupsGetMembershipCommand.description = 'Get information about a group membership';
GroupsGetMembershipCommand.examples = ['box groups:memberships:get 12345'];
GroupsGetMembershipCommand._endpoint = 'get_group_memberships_id';

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
