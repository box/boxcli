'use strict';

const BoxCommand = require('../../box-command');

class UsersInviteUserCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersInviteUserCommand);

		let user = await this.client.enterprise.inviteUser(args.enterpriseID, args.email);
		await this.output(user);
	}
}

UsersInviteUserCommand.aliases = [ 'users:invite-user' ];

UsersInviteUserCommand.description = 'Invite an Existing Box User to Your Enterprise';
UsersInviteUserCommand.examples = [
	'box users:invite user@example.com 12345'
];
UsersInviteUserCommand._endpoint = 'post_invites';

UsersInviteUserCommand.flags = {
	...BoxCommand.flags
};

UsersInviteUserCommand.args = [
	{
		name: 'email',
		required: true,
		hidden: false,
		description: 'Email address of the user to invite',
	},
	{
		name: 'enterpriseID',
		required: true,
		hidden: false,
		description: 'ID of the Enterprise to invite the user to',
	}
];

module.exports = UsersInviteUserCommand;
