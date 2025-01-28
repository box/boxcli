'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class UsersMoveRootContentCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersMoveRootContentCommand);
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
UsersMoveRootContentCommand.examples = ['box users:transfer-content 33333 44444'];
UsersMoveRootContentCommand._endpoint = 'put_users_id_folders_id';

UsersMoveRootContentCommand.flags = {
	...BoxCommand.flags,
	notify: Flags.boolean({
		description: 'Notify the user that their content has been moved',
		allowNo: true
	})
};

UsersMoveRootContentCommand.args = {
	userID: Args.string({
		name: 'userID',
		required: true,
		hidden: false,
		description: 'User whose content should be moved'
	}),
	newUserID: Args.string({
		name: 'newUserID',
		required: true,
		hidden: false,
		description: 'User to whom the content should be moved'
	}),
};

module.exports = UsersMoveRootContentCommand;
