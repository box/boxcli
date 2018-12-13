'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class UsersMoveRootContentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersMoveRootContentCommand);
		let params = {
			body: {
				owned_by: {
					id: args.newUserID
				}
			},
			qs: {}
		};

		if (flags.hasOwnProperty('notify')) {
			params.qs.notify = flags.notify;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK. Existing this.client.enterprise.transferUserContent() does not allow the notify option to be passed
		let movedFolder = await this.client.wrapWithDefaultHandler(this.client.put)(`/users/${args.userID}/folders/0`, params);
		await this.output(movedFolder);
	}
}

UsersMoveRootContentCommand.aliases = [ 'users:move-root-content' ];

UsersMoveRootContentCommand.description = 'Move a user\'s root content to another user';

UsersMoveRootContentCommand.flags = {
	...BoxCommand.flags,
	notify: flags.boolean({
		description: 'Notify the user that their content has been moved',
		allowNo: true
	})
};

UsersMoveRootContentCommand.args = [
	{
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User whose content should be moved'
	},
	{
		name: 'newUserID',
		required: true,
		hidden: false,
		description: 'User to whom the content should be moved'
	}
];

module.exports = UsersMoveRootContentCommand;
