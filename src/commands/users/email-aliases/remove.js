'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class UsersDeleteEmailAliasCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersDeleteEmailAliasCommand);

		await this.client.users.removeEmailAlias(args.userID, args.aliasID);
		this.info(`Removed alias ${args.aliasID} from user ${args.userID}`);
	}
}

UsersDeleteEmailAliasCommand.aliases = [ 'users:delete-email-alias' ];

UsersDeleteEmailAliasCommand.description = 'Delete an email alias from a user';
UsersDeleteEmailAliasCommand.examples = ['box users:email-aliases:remove 33333 12345'];
UsersDeleteEmailAliasCommand._endpoint = 'delete_users_id_email_aliases_id';

UsersDeleteEmailAliasCommand.flags = {
	...BoxCommand.flags
};

UsersDeleteEmailAliasCommand.args = {
	userID: Args.string({
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User ID to get email aliases'
	}),
	aliasID: Args.string({
		name: 'aliasID',
		required: true,
		hidden: false,
		description: 'The ID of the email alias to delete'
	}),
};

module.exports = UsersDeleteEmailAliasCommand;
