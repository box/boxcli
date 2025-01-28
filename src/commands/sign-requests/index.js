'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');

class SignRequestsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(SignRequestsListCommand);
		const { limit, marker } = flags;

		const signRequests = await this.client.signRequests.getAll({
			limit,
			marker,
		});

		await this.output(signRequests);
	}
}

SignRequestsListCommand.description = 'List sign requests';
SignRequestsListCommand.examples = ['box sign-requests'];
SignRequestsListCommand._endpoint = 'get_sign_requests';

SignRequestsListCommand.flags = {
	...BoxCommand.flags,
	limit: Flags.integer({
		description: 'The maximum number of items to return per page.',
	}),
	marker: Flags.string({
		description:
			'Defines the position marker at which to begin returning results. This is used when paginating using marker-based pagination. This requires `usemarker` to be set to `true`.',
	}),
};

module.exports = SignRequestsListCommand;
