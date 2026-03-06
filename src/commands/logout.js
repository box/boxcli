'use strict';

const BoxCommand = require('../box-command');
const BoxSDK = require('box-node-sdk').default;
const CLITokenCache = require('../token-cache');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { Flags } = require('@oclif/core');

function isBoxApiError(error) {
	return (
		error &&
		typeof error === 'object' &&
		(error.statusCode != null || (error.response && error.response.statusCode))
	);
}

class OAuthLogoutCommand extends BoxCommand {
	async run() {
		const environmentsObj = await this.getEnvironments();
		const currentEnv = environmentsObj?.default;

		const environment = currentEnv
			? environmentsObj.environments[currentEnv]
			: null;

			if (!currentEnv || !environment) {
			this.error(
				'No current environment found. Nothing to log out from.'
			);
		}

		if (environment.authMethod !== 'oauth20') {
			this.error(
				'Logout is only supported for OAuth environments. Your current environment uses a different authentication method.'
			);
		}

		const tokenCache = new CLITokenCache(currentEnv);
		const tokenInfo = await tokenCache.get();
		const accessToken = tokenInfo?.accessToken;
		if (!accessToken) {
			this.info(chalk`{green You are already logged out.}`);
			return;
		}

		if (!this.flags.force) {
			const confirmed = await this.confirm(
				`Do you want to logout from "${currentEnv}" environment?`,
				false
			);
			if (!confirmed) {
				this.info(chalk`{yellow Logout cancelled.}`);
				return;
			}
		}

		await this.revokeAndClearSession(accessToken, environment, tokenCache, currentEnv);
	}

	async revokeAndClearSession(accessToken, environment, tokenCache, currentEnv) {
		const sdk = new BoxSDK({
			clientID: environment.clientId,
			clientSecret: environment.clientSecret,
		});

		let revoked = false;
		while (!revoked) {
			try {
				await sdk.revokeTokens(accessToken);
				revoked = true;
			} catch (error) {
				const errorMessage = isBoxApiError(error)
					? error.message
					: 'Unexpected error. Cannot connect to Box servers.';
				const { action } = await inquirer.prompt([
					{
						type: 'list',
						name: 'action',
						message: chalk`Could not revoke token: {yellow ${errorMessage}}\nWhat would you like to do?`,
						choices: [
							{ name: 'Try revoking again', value: 'retry' },
							{ name: 'Clear local cache only (token remains valid on Box)', value: 'clear' },
							{ name: 'Abort', value: 'abort' },
						],
					},
				]);

				if (action === 'clear') {
					await new Promise((resolve, reject) => {
						tokenCache.clear((err) => (err ? reject(err) : resolve()));
					});
					this.info(
						chalk`{green Successfully logged out from "${currentEnv}". Local session cleared.}`
					);
					return;
				}
				if (action === 'abort') {
					this.info(
						chalk`{yellow Logout aborted. Token was not revoked and remains cached.}`
					);
					return;
				}
			}
		}

		await new Promise((resolve, reject) => {
			tokenCache.clear((err) => (err ? reject(err) : resolve()));
		});

		this.info(chalk`{green Successfully logged out from "${currentEnv}".}`);
	}
}

// @NOTE: This command skips client setup, since it may be used when token is expired
OAuthLogoutCommand.noClient = true;

OAuthLogoutCommand.description =
	'Sign out and clear local authentication state.';

OAuthLogoutCommand.flags = {
	...BoxCommand.minFlags,
	force: Flags.boolean({
		char: 'f',
		description: 'Skip confirmation prompt',
	}),
};

module.exports = OAuthLogoutCommand;
