'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const BoxCLIError = require('../../cli-error');

class TermsOfServiceSetUserStatusCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TermsOfServiceSetUserStatusCommand);
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
TermsOfServiceSetUserStatusCommand.examples = ['box terms-of-service:set-user-status 55555 --accept'];

TermsOfServiceSetUserStatusCommand.flags = {
	...BoxCommand.flags,
	accept: Flags.boolean({
		description: 'Set the user\'s status as accepted',
		exclusive: [ 'reject' ],
	}),
	reject: Flags.boolean({
		description: 'Set the user\'s status as rejected',
		exclusive: [ 'accept' ],
	}),
	'user-id': Flags.string({
		description: 'ID of the user to set status for; defaults to the current user',
	}),
};

TermsOfServiceSetUserStatusCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the terms of service to set the user status on',
	}),
};

module.exports = TermsOfServiceSetUserStatusCommand;
