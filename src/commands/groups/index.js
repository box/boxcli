'use strict';

const BoxCommand = require('../../box-command');

class GroupsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
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
	...BoxCommand.flags
};

module.exports = GroupsListCommand;
