'use strict';

const BoxCommand = require('../../box-command');

class UsersGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let user = await this.client.users.get(args.id, options);
		await this.output(user);
	}
}

UsersGetCommand.description = 'Get information about a Box user';
UsersGetCommand.examples = ['box users:get 33333'];
UsersGetCommand._endpoint = 'get_users_id';

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
