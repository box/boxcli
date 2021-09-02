'use strict';

const BoxCommand = require('../../box-command');

class SignRequestsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SignRequestsListCommand);
		let options = {};

		let signRequests = await this.client.signRequests.getAll(options);
		await this.output(signRequests);
	}
}

SignRequestsListCommand.description = 'List sign requests';
SignRequestsListCommand.examples = ['box sign-requests'];
SignRequestsListCommand._endpoint = 'get_sign_requests';

SignRequestsListCommand.flags = {
	...BoxCommand.flags
};

module.exports = SignRequestsListCommand;
