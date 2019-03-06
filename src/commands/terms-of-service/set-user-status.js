'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const BoxCLIError = require('../../cli-error');

class TermsOfServiceSetUserStatusCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TermsOfServiceSetUserStatusCommand);
		let options = {};

		if (flags['user-id']) {
			options.user_id = flags['user-id'];
		}

		let status;
		if (flags.accept) {
			status = true;
		} else if (flags.reject) {
			status = false;
		} else {
			throw new BoxCLIError('Either the --accept or --reject flag must be passed');
		}

		let tosStatus = await this.client.termsOfService.setUserStatus(args.id, status, options);
		await this.output(tosStatus);
	}
}

TermsOfServiceSetUserStatusCommand.description = 'Set a user\'s status on a terms of service with a terms of service Id';

TermsOfServiceSetUserStatusCommand.flags = {
	...BoxCommand.flags,
	accept: flags.boolean({
		description: 'Set the user\'s status as accepted',
		exclusive: [ 'reject' ],
	}),
	reject: flags.boolean({
		description: 'Set the user\'s status as rejected',
		exclusive: [ 'accept' ],
	}),
	'user-id': flags.string({
		description: 'ID of the user to set status for; defaults to the current user',
	}),
};

TermsOfServiceSetUserStatusCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the terms of service to set the user status on',
	},
];

module.exports = TermsOfServiceSetUserStatusCommand;
