'use strict';

const BoxCommand = require('../../../box-command');

class UsersAddEmailAliasCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersAddEmailAliasCommand);

		let alias = await this.client.users.addEmailAlias(args.userID, args.email);
		await this.output(alias);
	}
}

UsersAddEmailAliasCommand.aliases = [ 'users:add-email-alias' ];

UsersAddEmailAliasCommand.description = 'Add a new email alias to a user';

UsersAddEmailAliasCommand.flags = {
	...BoxCommand.flags
};

UsersAddEmailAliasCommand.args = [
	{
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User ID to add email alias'
	},
	{
		name: 'email',
		required: true,
		hidden: false,
		description: 'Email to add as alias'
	}
];

module.exports = UsersAddEmailAliasCommand;
