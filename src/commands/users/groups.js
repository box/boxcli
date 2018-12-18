'use strict';

const BoxCommand = require('../../box-command');

class UsersListGroupsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersListGroupsCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let groups = await this.client.users.getGroupMemberships(args.id, options);
		await this.output(groups);
	}
}

UsersListGroupsCommand.aliases = [ 'users:list-groups' ];

UsersListGroupsCommand.description = 'List groups a user belongs to';

UsersListGroupsCommand.flags = {
	...BoxCommand.flags
};

UsersListGroupsCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the user to get groups for',
	}
];

module.exports = UsersListGroupsCommand;
