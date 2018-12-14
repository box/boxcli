'use strict';

const BoxCommand = require('../../../box-command');

class UsersGetEmailAliasesCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersGetEmailAliasesCommand);

		let emailAliases = await this.client.users.getEmailAliases(args.userID);
		await this.output(emailAliases);
	}
}

UsersGetEmailAliasesCommand.aliases = [ 'users:get-email-aliases' ];

UsersGetEmailAliasesCommand.description = 'Get all Email Aliases for a User';

UsersGetEmailAliasesCommand.flags = {
	...BoxCommand.flags
};

UsersGetEmailAliasesCommand.args = [
	{
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User ID to get email aliases for',
	}
];

module.exports = UsersGetEmailAliasesCommand;
