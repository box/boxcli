'use strict';

const BoxCommand = require('../../box-command');

class GroupsDeleteCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(GroupsDeleteCommand);
		const { args } = this.parse(GroupsDeleteCommand);

		await this.client.groups.delete(args.id);
		this.info(`Deleted group ${args.id}`);
	}
}

GroupsDeleteCommand.description = 'Delete a group';

GroupsDeleteCommand.flags = {
	...BoxCommand.flags
};

GroupsDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to delete',
	}
];

module.exports = GroupsDeleteCommand;
