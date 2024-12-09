'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const UserModule = require('../../modules/user');
const PaginationUtils = require('../../pagination-utils');

class UsersListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(UsersListCommand);
		let options = PaginationUtils.forceMarkerPagination(flags);
		flags.limit = options.limit;
		flags.usemarker = options.usemarker;

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
	...PaginationUtils.flags,
	'managed-users': Flags.boolean({
		char: 'm',
		description: 'Limit results to managed users only',
		exclusive: [
			'app-users',
			'all-users'
		]
	}),
	'app-users': Flags.boolean({
		description: 'Limit results to app users only',
		exclusive: [
			'managed-users',
			'all-users',
			'filter'
		]
	}),
	'external-users': Flags.boolean({
		char: 'e',
		description: 'Limit results to external users only',
		exclusive: [
			'managed-users',
			'all-users'
		]
	}),
	'all-users': Flags.boolean({
		char: 'a',
		description: 'Results from all users',
		exclusive: [
			'external-users',
			'managed-users',
			'app-users'
		]
	}),
	filter: Flags.string({
		description: 'Search term to filter users on; matches prefixes of user name and login fields',
		exclusive: ['app-users'],
	})
};

module.exports = UsersListCommand;
