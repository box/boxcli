'use strict';

const BoxCommand = require('../../box-command');

class SignRequestsCancelCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(SignRequestsCancelCommand);

		const signRequest = await this.client.signRequests.cancelById({
			sign_request_id: args.id,
		});
		await this.output(signRequest);
	}
}

SignRequestsCancelCommand.description = 'Cancel sign request';
SignRequestsCancelCommand.examples = ['box sign-requests:cancel 12345'];
SignRequestsCancelCommand._endpoint = 'post_sign_requests_id_cancel';

SignRequestsCancelCommand.flags = {
	...BoxCommand.flags,
};

SignRequestsCancelCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the sign request',
	},
];

module.exports = SignRequestsCancelCommand;
