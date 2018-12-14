'use strict';

const BoxCommand = require('../../../box-command');

class UsersDeleteEmailAliasCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersDeleteEmailAliasCommand);

		await this.client.users.removeEmailAlias(args.userID, args.aliasID);
		this.info(`Removed alias ${args.aliasID} from user ${args.userID}`);
	}
}

UsersDeleteEmailAliasCommand.aliases = [ 'users:delete-email-alias' ];

UsersDeleteEmailAliasCommand.description = 'Delete an email alias from a user';

UsersDeleteEmailAliasCommand.flags = {
	...BoxCommand.flags
};

UsersDeleteEmailAliasCommand.args = [
	{
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User ID to get email aliases'
	},
	{
		name: 'aliasID',
		required: true,
		hidden: false,
		description: 'The ID of the email alias to delete'
	}
];

module.exports = UsersDeleteEmailAliasCommand;
