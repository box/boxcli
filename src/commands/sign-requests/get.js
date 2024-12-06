'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class SignRequestsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(SignRequestsGetCommand);

		const signRequest = await this.client.signRequests.getById({
			sign_request_id: args.id,
		});
		await this.output(signRequest);
	}
}

SignRequestsGetCommand.description = 'Get sign request by ID';
SignRequestsGetCommand.examples = ['box sign-requests:get 12345'];
SignRequestsGetCommand._endpoint = 'get_sign_requests_id';

SignRequestsGetCommand.flags = {
	...BoxCommand.flags,
};

SignRequestsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the sign request',
	}),
};

module.exports = SignRequestsGetCommand;
