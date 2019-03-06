'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class UsersListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		if (flags['all-users']) {
			options.user_type = 'all';
		} else if (flags['managed-users']) {
			options.user_type = 'managed';
		} else if (flags['app-users']) {
			options.filter_term = 'AppUser_';
		} else if (flags['external-users']) {
			options.user_type = 'external';
		}

		if (flags.filter) {
			options.filter_term = flags.filter;
		}

		let users = await this.client.enterprise.getUsers(options);
		await this.output(users);
	}
}

UsersListCommand.aliases = [ 'users:list' ];

UsersListCommand.description = 'List all Box users';

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
