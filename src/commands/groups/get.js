'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class GroupsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(GroupsGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let group = await this.client.groups.get(args.id, options);
		await this.output(group);
	}
}

GroupsGetCommand.description = 'Get information about a group';
GroupsGetCommand.examples = ['box groups:get 12345'];
GroupsGetCommand._endpoint = 'get_groups_id';

GroupsGetCommand.flags = {
	...BoxCommand.flags
};

GroupsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to get',
	}),
};

module.exports = GroupsGetCommand;
