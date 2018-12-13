'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class TermsOfServiceGetUserStatusCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TermsOfServiceGetUserStatusCommand);
		let options = {};

		if (flags['user-id']) {
			options.user_id = flags['user-id'];
		}

		let tosStatus = await this.client.termsOfService.getUserStatus(args.tosID, options);
		await this.output(tosStatus);
	}
}

TermsOfServiceGetUserStatusCommand.description = 'Get a user\'s status on a terms of service';

TermsOfServiceGetUserStatusCommand.flags = {
	...BoxCommand.flags,
	'user-id': flags.string({
		description: 'ID for a user to get status for; defaults to the current user ID',
	}),
};

TermsOfServiceGetUserStatusCommand.args = [
	{
		name: 'tosID',
		required: true,
		hidden: false,
		description: 'ID of the terms of service to get user status for',
	}
];

module.exports = TermsOfServiceGetUserStatusCommand;
