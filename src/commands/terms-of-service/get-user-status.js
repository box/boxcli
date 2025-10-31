'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class TermsOfServiceGetUserStatusCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			TermsOfServiceGetUserStatusCommand
		);
		let options = {};

		if (flags['user-id']) {
			options.user_id = flags['user-id'];
		}

		let tosStatus = await this.client.termsOfService.getUserStatus(
			args.tosID,
			options
		);
		await this.output(tosStatus);
	}
}

TermsOfServiceGetUserStatusCommand.description =
	"Get a user's status on a terms of service";
TermsOfServiceGetUserStatusCommand.examples = [
	'box terms-of-service:get-user-status 55555',
];
TermsOfServiceGetUserStatusCommand._endpoint =
	'get_terms_of_service_user_statuses';

TermsOfServiceGetUserStatusCommand.flags = {
	...BoxCommand.flags,
	'user-id': Flags.string({
		description:
			'ID for a user to get status for; defaults to the current user ID',
	}),
};

TermsOfServiceGetUserStatusCommand.args = {
	tosID: Args.string({
		name: 'tosID',
		required: true,
		hidden: false,
		description: 'ID of the terms of service to get user status for',
	}),
};

module.exports = TermsOfServiceGetUserStatusCommand;
