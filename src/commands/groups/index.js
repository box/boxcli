'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class GroupsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsListCommand);
		let options = {};

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

GroupsListCommand.aliases = [ 'groups:list' ];

GroupsListCommand.description = 'List all groups';
GroupsListCommand.examples = ['box groups'];
GroupsListCommand._endpoint = 'get_groups';

GroupsListCommand.flags = {
	...BoxCommand.flags,
	filter: flags.string({
		description: 'Search term to filter groups on; matches prefixes of group name',
	})
};

module.exports = GroupsListCommand;
