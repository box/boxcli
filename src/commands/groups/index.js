'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtils = require('../../pagination-utils');

class GroupsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(GroupsListCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		if (flags.filter) {
			options.filter_term = flags.filter;
		}

		let groups = await this.client.groups.getAll(options);
		await this.output(groups);
	}
}

GroupsListCommand.aliases = ['groups:list'];

GroupsListCommand.description = 'List all groups';
GroupsListCommand.examples = ['box groups'];
GroupsListCommand._endpoint = 'get_groups';

GroupsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	filter: Flags.string({
		description:
			'Search term to filter groups on; matches prefixes of group name',
	}),
};

module.exports = GroupsListCommand;
