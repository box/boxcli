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
	'Get a token. Returns the service account token by default';

TokensGetCommand.flags = {
	...BoxCommand.minFlags,
	'user-id': Flags.string({
		char: 'u',
		description: 'Get a user token from a user ID',
	}),
};

module.exports = TokensGetCommand;
