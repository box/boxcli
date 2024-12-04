'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class TokensExchangeCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TokensExchangeCommand);

		let client = this.client;
		if (flags.token) {
			client = this.sdk.getBasicClient(flags.token);
		}
		if (flags['user-id']) {
			client = this.sdk.getAppAuthClient('user', flags['user-id']);
		}

		let resource = null;
		if (flags['file-id']) {
			resource = `https://api.box.com/2.0/files/${flags['file-id']}`;
		} else if (flags['folder-id']) {
			resource = `https://api.box.com/2.0/folders/${flags['folder-id']}`;
		}

		let tokenInfo = await client.exchangeToken(args.scope.split(','), resource);

		this.output(tokenInfo.accessToken);
	}
}

TokensExchangeCommand.description = 'Get a token. Returns the service account token by default';

TokensExchangeCommand.args = {
	scope: Args.string({
		name: 'scope',
		required: true,
		hidden: false,
		description: 'The scope(s) for the new token, separated by a comma if multiple are present'
	}),
};

TokensExchangeCommand.flags = {
	...BoxCommand.minFlags,
	'user-id': Flags.string({
		char: 'u',
		description: 'Get a user token from a user ID',
		exclusive: ['token'],
	}),
	'file-id': Flags.string({
		description: 'Scope the token to a specific file',
		exclusive: ['folder-id'],
	}),
	'folder-id': Flags.string({
		description: 'Scope the token to a specific folder',
		exclusive: ['file-id'],
	}),
	token: Flags.string({
		char: 't',
		description: 'Specify the token to exchange',
		exclusive: ['user-id'],
	})
};

module.exports = TokensExchangeCommand;
