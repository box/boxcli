'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const UsersListCommand = require('.');

class UsersSearchCommand extends BoxCommand {
	run() {
		const { flags, args } = this.parse(UsersSearchCommand);

		let argv = this.argv.map(arg => (arg === args.name ? `--filter=${arg}` : arg));
		return UsersListCommand.run(argv);
	}
}

UsersSearchCommand.hidden = true;

UsersSearchCommand.description = 'Search for Box users';

UsersSearchCommand.flags = {
	...BoxCommand.flags,
	'managed-users': flags.boolean({
		char: 'm',
		description: 'Limit results to managed users only',
		exclusive: [
			'external-users',
			'all-users'
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
			'managed-users'
		]
	})
};

UsersSearchCommand.args = [
	{
		name: 'name',
		required: true,
		hidden: false,
		description: 'Name of user to search for'
	}
];

module.exports = UsersSearchCommand;
