'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class GroupsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(GroupsDeleteCommand);

		await this.client.groups.delete(args.id);
		this.info(`Deleted group ${args.id}`);
	}
}

GroupsDeleteCommand.description = 'Delete a group';
GroupsDeleteCommand.examples = ['box groups:delete 12345'];
GroupsDeleteCommand._endpoint = 'delete_groups_id';

GroupsDeleteCommand.flags = {
	...BoxCommand.flags
};

GroupsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to delete',
	}),
};

module.exports = GroupsDeleteCommand;
