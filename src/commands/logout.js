'use strict';

const BoxCommand = require('../box-command');
const BoxSDK = require('box-node-sdk').default;
const CLITokenCache = require('../token-cache');
const chalk = require('chalk');
const inquirer = require('inquirer');
const pkg = require('../../package.json');
const { Flags } = require('@oclif/core');

const SDK_CONFIG = Object.freeze({
	analyticsClient: { version: pkg.version },
	request: {
		headers: { 'User-Agent': `Box CLI v${pkg.version}` },
	},
});

function isInvalidTokenResponse(response) {
	return (
		response?.statusCode === 400 &&
		response?.body?.error === 'invalid_token'
	);
}

function isSuccessResponse(response) {
	return response?.statusCode === 200;
}

function getRevokeErrorMessage(thrownError, response) {
	if (thrownError) {
		return (
			thrownError.message ||
			'Unexpected error. Cannot connect to Box servers.'
		);
	}
	return (
		response?.body?.error_description ||
		`Request failed with status ${response?.statusCode ?? response?.status}` ||
		'Unknown error'
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

		const tokenCache = new CLITokenCache(currentEnv);
		const tokenInfo = await tokenCache.get();
		const accessToken = tokenInfo?.accessToken;
		if (!accessToken) {
			this.info(
				chalk`{green You are already logged out from "${currentEnv}" environment.}`
			);
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

		await this.revokeAndClearSession(
			accessToken,
			tokenCache,
			currentEnv,
			environment
		);
	}

	async revokeAndClearSession(
		accessToken,
		tokenCache,
		currentEnv,
		environment
	) {
		while (true) {
			let response;
			let thrownError;
			const { clientId, clientSecret } =
				this.getClientCredentials(environment);
			if (!clientId || !clientSecret) {
				thrownError = new Error('Invalid client credentials.');
				response = undefined;
			} else {
				const sdk = new BoxSDK({
					clientID: clientId,
					clientSecret,
					...SDK_CONFIG,
				});
				try {
					response = await sdk.revokeTokens(accessToken);
				} catch (error) {
					thrownError = error;
				}
			}

			if (isSuccessResponse(response)) {
				break;
			}

			if (isInvalidTokenResponse(response)) {
				this.info(
					chalk`{yellow Access token is already invalid. Clearing local session.}`
				);
				break;
			}

			const action = await this.promptRevokeFailureAction(
				thrownError,
				response
			);

			if (action === 'abort') {
				this.info(
					chalk`{yellow Logout aborted. Token was not revoked and remains cached.}`
				);
				return;
			}
			if (action === 'clear') {
				break;
			}
		}

		await new Promise((resolve, reject) => {
			tokenCache.clear((err) => (err ? reject(err) : resolve()));
		});
		this.info(
			chalk`{green Successfully logged out from "${currentEnv}" environment.}`
		);
	}

	getClientCredentials(environment) {
		if (environment.boxConfigFilePath) {
			try {
				const fs = require('node:fs');
				const configObj = JSON.parse(
					fs.readFileSync(environment.boxConfigFilePath)
				);
				return {
					clientId: configObj?.boxAppSettings?.clientID ?? '',
					clientSecret: configObj?.boxAppSettings?.clientSecret ?? '',
				};
			} catch {
				// fall through to environment
			}
		}
		return {
			clientId: environment.clientId ?? '',
			clientSecret: environment.clientSecret ?? '',
		};
	}

	async promptRevokeFailureAction(thrownError, response) {
		const onRevokeFailure = this.flags['on-revoke-failure'];
		if (onRevokeFailure) {
			return onRevokeFailure;
		}
		const result = await inquirer.prompt([
			{
				type: 'list',
				name: 'action',
				message: chalk`Could not revoke token: {red ${getRevokeErrorMessage(thrownError, response)}}\nWhat would you like to do?`,
				choices: [
					{ name: 'Try revoking again', value: 'retry' },
					{
						name: 'Clear local session only (token remains valid on Box)',
						value: 'clear',
					},
					{ name: 'Abort', value: 'abort' },
				],
			},
		]);
		return result.action;
	}
}

// @NOTE: This command skips client setup, since it may be used when token is expired
OAuthLogoutCommand.noClient = true;

OAuthLogoutCommand.description = [
	'Revoke the access token and clear local token cache.',
	'',
	'For OAuth, run `box login` to authorize again.',
	'For CCG and JWT, a new token is fetched automatically on the next command.',
	'',
	'Use -f and --on-revoke-failure=clear or --on-revoke-failure=abort to skip the interactive prompt.',
].join('\n');

OAuthLogoutCommand.flags = {
	...BoxCommand.minFlags,
	force: Flags.boolean({
		char: 'f',
		description: 'Skip confirmation prompt',
	}),
	'on-revoke-failure': Flags.string({
		description:
			'On revoke failure: "clear" clears local cache only, "abort" exits without clearing. Skips prompt.',
		options: ['clear', 'abort'],
	}),
};

module.exports = OAuthLogoutCommand;
