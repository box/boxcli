'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class UsersDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersDeleteCommand);
		let options = {};

		if (flags.hasOwnProperty('notify')) {
			options.notify = flags.notify;
		}
		if (flags.hasOwnProperty('force')) {
			options.force = flags.force;
		}

		await this.client.users.delete(args.id, options);
		this.info(`Deleted user ${args.id}`);
	}
}

UsersDeleteCommand.description = 'Delete a Box User';
UsersDeleteCommand.examples = [
	'box users:delete 33333'
];
UsersDeleteCommand._endpoint = 'delete_users_id';

UsersDeleteCommand.flags = {
	...BoxCommand.flags,
	notify: flags.boolean({
		description: 'The user should be notified',
		allowNo: true
	}),
	force: flags.boolean({
		char: 'f',
		description: 'Delete user even if they own files',
	}),
};

UsersDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'User ID to delete',
	}
];

module.exports = UsersDeleteCommand;
