'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class UsersAddEmailAliasCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersAddEmailAliasCommand);

		let options = {};

		if (Object.hasOwn(flags, 'confirm')) {
			options.is_confirmed = flags.confirm;
		}

		let alias = await this.client.users.addEmailAlias(
			args.userID,
			args.email,
			options
		);
		await this.output(alias);
	}
}

UsersAddEmailAliasCommand.aliases = ['users:add-email-alias'];

UsersAddEmailAliasCommand.description = 'Add a new email alias to a user';
UsersAddEmailAliasCommand.examples = [
	'box users:email-aliases:add 33333 user+alias@example.com',
];
UsersAddEmailAliasCommand._endpoint = 'post_users_id_email_aliases';

UsersAddEmailAliasCommand.flags = {
	...BoxCommand.flags,
	confirm: Flags.boolean({
		allowNo: true,
		description:
			'Whether or not to confirm the email alias.  Only Admins may automatically confirm an alias.',
	}),
};

UsersAddEmailAliasCommand.args = {
	userID: Args.string({
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User ID to add email alias',
	}),
	email: Args.string({
		name: 'email',
		required: true,
		hidden: false,
		description: 'Email to add as alias',
	}),
};

module.exports = UsersAddEmailAliasCommand;
