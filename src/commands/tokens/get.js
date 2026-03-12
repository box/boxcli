'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');

class TokensGetCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(TokensGetCommand);
		let token;

		token = await (flags['user-id']
			? this.sdk.getAppUserTokens(flags['user-id'])
			: this.sdk.getEnterpriseAppAuthTokens());
		this.output(token.accessToken);
	}
}

TokensGetCommand.description =
	'Generate a new access token. Returns a service account token for the default environment unless --user-id is specified.';
TokensGetCommand.examples = [
	'box tokens:get',
	'box tokens:get --user-id 12345',
];

TokensGetCommand.flags = {
	...BoxCommand.minFlags,
	'user-id': Flags.string({
		char: 'u',
		description: 'Generate a user token for the specified user ID',
	}),
};

module.exports = TokensGetCommand;
