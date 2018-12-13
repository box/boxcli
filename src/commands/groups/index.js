'use strict';

const BoxCommand = require('../../box-command');

class GroupsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsListCommand);

		let groups = await this.client.groups.getAll();
		await this.output(groups);
	}
}

GroupsListCommand.aliases = [ 'groups:list' ];

GroupsListCommand.description = 'List all groups';

GroupsListCommand.flags = {
	...BoxCommand.flags
};

module.exports = GroupsListCommand;
