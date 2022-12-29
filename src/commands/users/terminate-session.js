'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class UsersTerminateSessionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersTerminateSessionCommand);

        if (!flags['user-ids'] && !flags['user-logins']) {
            throw new Error('You must specify at least one user ID or login');
        }
        let response = await this.client.users.terminateSession({
            user_ids: flags['user-ids'],
            user_logins: flags['user-logins']
        });
        await this.output(response);
	}
}

UsersTerminateSessionCommand.aliases = [ 'users:terminate-session' ];

UsersTerminateSessionCommand.description = 'Validates the roles and permissions of the user, and creates asynchronous jobs to terminate the user\'s sessions.';
UsersTerminateSessionCommand.examples = ['box users:terminate-session --user-ids 123 345 --user-logins abc@example.com def@example.com'];
UsersTerminateSessionCommand._endpoint = 'post_users_terminate_sessions';

UsersTerminateSessionCommand.flags = {
	...BoxCommand.flags,
    'user-ids': flags.string({
        description: 'A list of user IDs',
        multiple: true,
    }),
    'user-logins': flags.string({
        description: 'A list of user logins',
        multiple: true,
    }),
};

UsersTerminateSessionCommand.args = [];

module.exports = UsersTerminateSessionCommand;
