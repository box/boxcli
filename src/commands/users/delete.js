'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class UsersDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersDeleteCommand);
		let options = {};

		if (Object.hasOwn(flags, 'notify')) {
			options.notify = flags.notify;
		}
		if (Object.hasOwn(flags, 'force')) {
			options.force = flags.force;
		}

		await this.client.users.delete(args.id, options);
		this.info(`Deleted user ${args.id}`);
	}
}

UsersDeleteCommand.description = 'Delete a Box User';
UsersDeleteCommand.examples = ['box users:delete 33333'];
UsersDeleteCommand._endpoint = 'delete_users_id';

UsersDeleteCommand.flags = {
	...BoxCommand.flags,
	notify: Flags.boolean({
		description: 'The user should be notified',
		allowNo: true,
	}),
	force: Flags.boolean({
		char: 'f',
		description: 'Delete user even if they own files',
	}),
};

UsersDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'User ID to delete',
	}),
};

module.exports = UsersDeleteCommand;
