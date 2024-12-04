'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');
const PaginationUtils = require('../../pagination-utils');

class UsersListGroupsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersListGroupsCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let groups = await this.client.users.getGroupMemberships(args.id, options);
		await this.output(groups);
	}
}

UsersListGroupsCommand.aliases = [ 'users:list-groups' ];

UsersListGroupsCommand.description = 'List groups a user belongs to';
UsersListGroupsCommand.examples = ['box users:groups 33333'];
UsersListGroupsCommand._endpoint = 'get_users_id_memberships';

UsersListGroupsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

UsersListGroupsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the user to get groups for',
	}),
};

module.exports = UsersListGroupsCommand;
