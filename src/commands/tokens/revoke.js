'use strict';

const BoxCommand = require('../../box-command');
const { Args } = require('@oclif/core');
const chalk = require('chalk');
const {
	AuthorizationManager,
} = require('box-node-sdk/sdk-gen/managers/authorization');
const BoxTsErrors = require('box-node-sdk/sdk-gen/box/errors');

class TokensRevokeCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(TokensRevokeCommand);

		if (this.usesPublicClientAuth()) {
			// The legacy SDK always sends a client secret, which public clients do not have.
			// The manager gets no auth, so the environment's own token is not sent with the request.
			const authorizationManager = new AuthorizationManager({
				networkSession: this.tsClient.networkSession,
			});
			try {
				await authorizationManager.revokeAccessToken({
					clientId: this._publicClientAuth.config.clientId,
					token: args.token,
				});
				this.info(chalk`{green Token revoked.}`);
			} catch (error) {
				if (!(error instanceof BoxTsErrors.BoxApiError)) {
					throw error;
				}
				// The SDK does not read the body of revoke responses, so Box's error description is not available.
				const reason =
					error.responseInfo?.body?.error_description ??
					`Request failed with status ${error.responseInfo?.statusCode}`;
				this.info(chalk`{redBright Error revoking token!  ${reason}}`);
			}
			return;
		}

		let response = await this.sdk.revokeTokens(args.token);

		if (response.statusCode === 200) {
			this.info(chalk`{green Token revoked.}`);
		} else {
			this.info(
				chalk`{redBright Error revoking token!  ${response.body.error_description}}`
			);
		}
	}
}

TokensRevokeCommand.description =
	'Revoke a token.  The token will no longer be valid for making API calls.';

TokensRevokeCommand.args = {
	token: Args.string({
		name: 'token',
		required: true,
		hidden: false,
		description: 'The token to revoke',
	}),
};

TokensRevokeCommand.flags = {
	...BoxCommand.minFlags,
};

module.exports = TokensRevokeCommand;
