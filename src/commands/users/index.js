'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const UserModule = require('../../modules/user');

class UsersListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersListCommand);

		let userModule = new UserModule(this.client);
		let users = await userModule.listUsers(flags);
		await this.output(users);
	}
}

UsersListCommand.aliases = [ 'users:list' ];

UsersListCommand.description = 'List all Box users';
UsersListCommand.examples = ['box users'];
UsersListCommand._endpoint = 'get_users';

UsersListCommand.flags = {
	...BoxCommand.flags,
	'managed-users': flags.boolean({
		char: 'm',
		description: 'Limit results to managed users only',
		exclusive: [
			'app-users',
			'all-users'
		]
	}),
	'app-users': flags.boolean({
		description: 'Limit results to app users only',
		exclusive: [
			'managed-users',
			'all-users',
			'filter'
		]
	}),
	'external-users': flags.boolean({
		char: 'e',
		description: 'Limit results to external users only',
		exclusive: [
			'managed-users',
			'all-users'
		]
	}),
	'all-users': flags.boolean({
		char: 'a',
		description: 'Results from all users',
		exclusive: [
			'external-users',
			'managed-users',
			'app-users'
		]
	}),
	filter: flags.string({
		description: 'Search term to filter users on; matches prefixes of user name and login fields',
		exclusive: ['app-users'],
	})
};

module.exports = UsersListCommand;
