'use strict';

const BoxCommand = require('../../box-command');

class SignRequestsResendCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(SignRequestsResendCommand);

		await this.client.signRequests.resendById({
			sign_request_id: args.id,
		});
		this.info(`Resent sign request ${args.id}`);
	}
}

SignRequestsResendCommand.description = 'Resend sign request';
SignRequestsResendCommand.examples = ['box sign-requests:resend 12345'];
SignRequestsResendCommand._endpoint = 'post_sign_requests_id_resend';

SignRequestsResendCommand.flags = {
	...BoxCommand.flags,
};

SignRequestsResendCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the sign request',
	},
];

module.exports = SignRequestsResendCommand;
