'use strict';

const BoxCommand = require('../../box-command');

class GroupsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsGetCommand);

		let group = await this.client.groups.get(args.id);
		await this.output(group);
	}
}

GroupsGetCommand.description = 'Get information about a group';

GroupsGetCommand.flags = {
	...BoxCommand.flags
};

GroupsGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to get',
	}
];

module.exports = GroupsGetCommand;
