'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtils = require('../../../pagination-utils');

class GroupsListMembershipCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(GroupsListMembershipCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let members = await this.client.groups.getMemberships(args.id, options);
		await this.output(members);
	}
}

GroupsListMembershipCommand.aliases = [ 'groups:membership:list' ];

GroupsListMembershipCommand.description = 'List members of a group';
GroupsListMembershipCommand.examples = ['box groups:memberships 12345'];
GroupsListMembershipCommand._endpoint = 'get_groups_id_memberships';

GroupsListMembershipCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

GroupsListMembershipCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to get memberships for',
	}),
};

module.exports = GroupsListMembershipCommand;
