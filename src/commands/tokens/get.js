'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class TokensGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TokensGetCommand);
		let token;

		if (flags['user-id']) {
			token = await this.sdk.getAppUserTokens(flags['user-id']);

		} else {
			token = await this.sdk.getEnterpriseAppAuthTokens();
		}
		this.output(token.accessToken);
	}
}

TokensGetCommand.description = 'Get a token. Returns the service account token by default';

TokensGetCommand.flags = {
	...BoxCommand.minFlags,
	'user-id': flags.string({
		char: 'u',
		description: 'Get a user token from a user ID',
	})
};

module.exports = TokensGetCommand;
