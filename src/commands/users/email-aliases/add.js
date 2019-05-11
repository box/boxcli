'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class UsersAddEmailAliasCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersAddEmailAliasCommand);

		let options = {};

		if (flags.hasOwnProperty('confirm')) {
			options.is_confirmed = flags.confirm;
		}

		let alias = await this.client.users.addEmailAlias(args.userID, args.email, options);
		await this.output(alias);
	}
}

UsersAddEmailAliasCommand.aliases = [ 'users:add-email-alias' ];

UsersAddEmailAliasCommand.description = 'Add a new email alias to a user';

UsersAddEmailAliasCommand.flags = {
	...BoxCommand.flags,
	confirm: flags.boolean({
		allowNo: true,
		description: 'Whether or not to confirm the email alias.  Only Admins may automatically confirm an alias.'
	}),
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
