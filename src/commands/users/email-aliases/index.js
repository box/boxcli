'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class UsersGetEmailAliasesCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersGetEmailAliasesCommand);

		let emailAliases = await this.client.users.getEmailAliases(args.userID);
		await this.output(emailAliases);
	}
}

UsersGetEmailAliasesCommand.aliases = [ 'users:get-email-aliases' ];

UsersGetEmailAliasesCommand.description = 'Get all Email Aliases for a User';
UsersGetEmailAliasesCommand.examples = ['box users:email-aliases 33333'];
UsersGetEmailAliasesCommand._endpoint = 'get_users_id_email_aliases';

UsersGetEmailAliasesCommand.flags = {
	...BoxCommand.flags
};

UsersGetEmailAliasesCommand.args = {
	userID: Args.string({
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User ID to get email aliases for',
	}),
};

module.exports = UsersGetEmailAliasesCommand;
