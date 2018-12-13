'use strict';

const BoxCommand = require('../../box-command');

class UsersGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersGetCommand);

		let user = await this.client.users.get(args.id);
		await this.output(user);
	}
}

UsersGetCommand.description = 'Get information about a Box user';

UsersGetCommand.flags = {
	...BoxCommand.flags
};

UsersGetCommand.args = [
	{
		name: 'id',
		required: false,
		hidden: false,
		default: 'me',
		description: 'ID of the user to get; defaults to the current user',
	}
];

module.exports = UsersGetCommand;
