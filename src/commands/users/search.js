'use strict';

const BoxCommand = require('../../box-command');
const UsersListCommand = require('.'); // This points to ./index.js
const UserModule = require('../../modules/user');
const _ = require('lodash');
const { Args } = require('@oclif/core');

class UsersSearchCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersSearchCommand);

		flags.filter = args.name;

		let userModule = new UserModule(this.client);
		let users = await userModule.listUsers(flags);
		await this.output(users);
	}
}

UsersSearchCommand.description = 'Search for Box users';
UsersSearchCommand.examples = ['box users:search "John Doe"'];

UsersSearchCommand.flags = {
	...BoxCommand.flags,
	..._.pick(UsersListCommand.flags, [
		'managed-users',
		'external-users',
		'all-users'
	]),
};

UsersSearchCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Name of user to search for'
	}),
};

module.exports = UsersSearchCommand;
