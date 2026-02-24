'use strict';

const BoxCommand = require('../box-command');
const { Flags } = require('@oclif/core');
const fs = require('node:fs');
const BoxSDK = require('box-node-sdk').default;
const BoxCLIError = require('../cli-error');
const CLITokenCache = require('../token-cache');
const package_ = require('../../package.json');
const chalk = require('chalk');
const express = require('express');
const inquirer = require('inquirer');
const path = require('node:path');
const ora = require('ora');
const http = require('node:http');
const { nanoid } = require('nanoid');
const { generatePKCE } = require('../pkce-support');
const {
	assertValidOAuthCode,
	getTokenInfoWithPKCE,
} = require('../login-helper');

const GENERIC_OAUTH_CLIENT_ID = '<< OAUTH CLIENT ID HERE >>';
const GENERIC_OAUTH_CLIENT_SECRET = '<< OAUTH CLIENT SECRET HERE >>';
const SUPPORTED_DEFAULT_APP_PORTS = [3000, 3001, 4000, 5000, 8080];

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const openModule = await import('open');
		const open = openModule.default;
		const apps = openModule.apps;

		const { flags } = await this.parse(OAuthLoginCommand);
		const forceDefaultBoxApp = flags['default-box-app'];
		const forceCustomApp = flags['custom-app'];

		let useDefaultBoxApp = false;
		const environmentsObject = await this.getEnvironments();
		const port = flags.port;
		const redirectUri = `http://localhost:${port}/callback`;
		let environment;

		if (this.flags.reauthorize) {
			if (
				!Object.hasOwn(environmentsObject.environments, this.flags.name)
			) {
				this.error(`The ${this.flags.name} environment does not exist`);
			}

			environment = environmentsObject.environments[this.flags.name];
			if (environment.authMethod !== 'oauth20') {
				this.error('The selected environment is not of type oauth20');
			}
			if (forceDefaultBoxApp) {
				useDefaultBoxApp = true;
				environment.clientId = GENERIC_OAUTH_CLIENT_ID;
				environment.clientSecret = GENERIC_OAUTH_CLIENT_SECRET;
			} else if (forceCustomApp) {
				useDefaultBoxApp = false;
			} else {
				useDefaultBoxApp =
					environment.clientId === GENERIC_OAUTH_CLIENT_ID &&
					environment.clientSecret === GENERIC_OAUTH_CLIENT_SECRET;
			}
			if (
				useDefaultBoxApp &&
				!SUPPORTED_DEFAULT_APP_PORTS.includes(flags.port)
			) {
				this.error(
					`Unsupported port "${flags.port}" for the Official Box CLI app flow. Supported ports: ${SUPPORTED_DEFAULT_APP_PORTS.join(', ')}`
				);
			}
		} else {
			if (forceDefaultBoxApp) {
				useDefaultBoxApp = true;
			} else if (forceCustomApp) {
				useDefaultBoxApp = false;
			} else {
				const loginChoice = await inquirer.prompt([
					{
						type: 'list',
						name: 'loginType',
						message: 'Which login flow do you want to use?',
						choices: [
							{
								name: 'Official Box CLI app (limited scopes to content actions) - the easiest way to get started with Box',
								value: 'default-box-app',
							},
							{
								name: 'Your custom app (create it in Box Developer Console) - lets you customize scopes for your needs and unlock more capabilities',
								value: 'custom-app',
							},
						],
						default: 'default-box-app',
					},
				]);

				useDefaultBoxApp = loginChoice.loginType === 'default-box-app';
			}
			if (
				useDefaultBoxApp &&
				!SUPPORTED_DEFAULT_APP_PORTS.includes(flags.port)
			) {
				this.error(
					`Unsupported port "${flags.port}" for the Official Box CLI app flow. Supported ports: ${SUPPORTED_DEFAULT_APP_PORTS.join(', ')}`
				);
			}
		}

		if (this.flags.reauthorize) {
			// Keep the selected existing environment config for reauthorization.
		} else if (useDefaultBoxApp) {
			this.info(chalk`{cyan ----------------------------------------}`);
			this.info(
				chalk`{cyan No app setup is required in Box Developer Console.}`
			);
			this.info(chalk`{cyan Callback URL: {italic ${redirectUri}}}`);
			this.info(
				chalk`{cyan Supported callback ports for this flow: {bold 3000}, {bold 3001}, {bold 4000}, {bold 5000}, {bold 8080}.}`
			);
			this.info(
				chalk`{cyan You can change the port with {bold --port}, but only to one of the supported values above.}`
			);
			this.info(chalk`{cyan ----------------------------------------}`);

			environment = {
				clientId: GENERIC_OAUTH_CLIENT_ID,
				clientSecret: GENERIC_OAUTH_CLIENT_SECRET,
				name: this.flags.name,
				cacheTokens: true,
				authMethod: 'oauth20',
			};
		} else {
			this.info(chalk`{cyan ----------------------------------------}`);
			this.info(
				chalk`{cyan If you are not using the quickstart guide to set up ({underline https://developer.box.com/guides/tooling/cli/quick-start/}) then go to the Box Developer console ({underline https://cloud.app.box.com/developers/console}) and:}`
			);
			this.info(
				chalk`{cyan 1. Select an application with OAuth user authentication method. Create a new Custom App if needed.}`
			);
			this.info(
				chalk`{cyan 2. Click on the Configuration tab and set the Redirect URI to: {italic ${redirectUri}}. Click outside the input field.}`
			);
			this.info(chalk`{cyan 3. Click on {bold Save Changes}.}`);
			this.info(chalk`{cyan ----------------------------------------}`);

			const answers = await inquirer.prompt([
				{
					type: 'input',
					name: 'clientID',
					message: 'What is the OAuth Client ID of your application?',
				},
				{
					type: 'input',
					name: 'clientSecret',
					message:
						'What is the OAuth Client Secret of your application?',
				},
			]);

			environment = {
				clientId: answers.clientID,
				clientSecret: answers.clientSecret,
				name: this.flags.name,
				cacheTokens: true,
				authMethod: 'oauth20',
			};
		}

		const environmentName = environment.name;
		const sdkConfig = Object.freeze({
			analyticsClient: {
				version: package_.version,
			},
		});
		const sdk = new BoxSDK({
			clientID: environment.clientId,
			clientSecret: environment.clientSecret,
		});
		this._configureSdk(sdk, sdkConfig);

		const app = express();
		let server;

		server = app.listen(port);

		const state = nanoid(32);
		const pkce = useDefaultBoxApp ? generatePKCE() : null;

		app.get('/callback', async (request, res) => {
			try {
				if (request.query.state !== state) {
					throw new BoxCLIError(
						`Invalid OAuth state received in callback. Got "${request.query.state}" while expecting "${state}"`
					);
				}
				assertValidOAuthCode(request.query.code);
				const tokenInfo = useDefaultBoxApp
					? await getTokenInfoWithPKCE(
							sdk,
							request.query.code,
							redirectUri,
							pkce.codeVerifier
						)
					: await sdk.getTokensAuthorizationCodeGrant(
							request.query.code,
							null
						);
				const tokenCache = new CLITokenCache(environmentName);
				await new Promise((resolve, reject) => {
					tokenCache.write(tokenInfo, (error) => {
						if (error) {
							reject(error);
						} else {
							resolve();
						}
					});
				});
				const client = sdk.getPersistentClient(tokenInfo, tokenCache);

				const user = await client.users.get('me');

				environmentsObject.environments[environmentName] = environment;
				environmentsObject.default = environmentName;
				await this.updateEnvironments(environmentsObject);

				const callbackHtmlPath = path.resolve(
					__dirname,
					'../logged-in.html'
				);

				let html = fs.readFileSync(callbackHtmlPath, 'utf8');
				html = html.replace('example@box.com', user.login);
				res.send(html);

				this.info(
					chalk`{green Successfully logged in as ${user.login}!}`
				);
				if (this.flags.reauthorize) {
					this.info(
						chalk`{green Environment "${environmentName}" has been updated, selected and it's ready to use.}`
					);
				} else {
					this.info(
						chalk`{green New environment "${environmentName}" has been created and selected.}`
					);
					this.info(
						chalk`{green You are set up to make your first API call. Refer to the CLI commands library (https://github.com/box/boxcli#command-topics) for examples.}`
					);
				}
			} catch (error) {
				throw new BoxCLIError(error);
			} finally {
				server.close();
			}
		});

		let spinner = ora({
			text: chalk`{bgCyan Opening browser for OAuth authentication. Please click {bold Grant access to Box} to continue.}`,
			spinner: 'bouncingBall',
		}).start();

		await new Promise((resolve) => setTimeout(resolve, 1000));

		spinner.succeed();

		// the URL to redirect the user to
		const authorizeUrl = sdk.getAuthorizeURL({
			response_type: 'code',
			state,
			redirect_uri: redirectUri,
			...(useDefaultBoxApp
				? {
						code_challenge: pkce.codeChallenge,
					}
				: {}),
		});
		if (flags.code) {
			this.info(
				chalk`{green Please open ${authorizeUrl} to authorize the application and read parameters from the URL accessed after authorization.}`
			);
			this.info(
				chalk`{yellow If you are not seeing your code, please make sure you have set up the Redirect URI.}`
			);
			const authInfo = await inquirer.prompt([
				{
					type: 'input',
					name: 'code',
					message: 'What is your auth code? (code=)',
				},
				{
					type: 'input',
					name: 'state',
					message: 'What is your state code? (state=)',
				},
			]);
			http.get(
				`http://localhost:${port}/callback?state=${authInfo.state}&code=${authInfo.code}`
			);
		} else {
			if (flags['incognito-browser']) {
				open(authorizeUrl, {
					newInstance: true,
					app: { name: apps.browserPrivate },
				});
			} else {
				open(authorizeUrl);
			}
			this.info(
				useDefaultBoxApp
					? chalk`{yellow If authorization fails, verify that you are using one of the supported ports for the Official Box CLI app flow and restart the login command.}`
					: chalk`{yellow If you are redirect to files view, please make sure that your Redirect URI is set up correctly and restart the login command.}`
			);
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
OAuthLoginCommand.noClient = true;

OAuthLoginCommand.description =
	'Sign in with OAuth and set a new environment or update an existing if reauthorize flag is used.';

OAuthLoginCommand.flags = {
	...BoxCommand.minFlags,
	code: Flags.boolean({
		char: 'c',
		description: 'Manually visit authorize URL and input code',
		default: false,
	}),
	name: Flags.string({
		char: 'n',
		description: 'Set a name for the environment',
		default: 'oauth',
	}),
	port: Flags.integer({
		char: 'p',
		description: 'Set the port number for the local OAuth callback server',
		default: 3000,
	}),
	'default-box-app': Flags.boolean({
		description:
			'Use the Official Box CLI app flow and skip login type selection. Supported --port values: 3000, 3001, 4000, 5000, 8080',
		exclusive: ['custom-app'],
		default: false,
	}),
	'custom-app': Flags.boolean({
		description:
			'Use your custom app flow and skip login type selection.',
		exclusive: ['default-box-app'],
		default: false,
	}),
	reauthorize: Flags.boolean({
		char: 'r',
		description: 'Reauthorize the existing environment with given `name`',
		dependsOn: ['name'],
		default: false,
	}),
	'incognito-browser': Flags.boolean({
		char: 'i',
		description: 'Visit authorize URL with incognito browser',
		default: false,
	}),
};

module.exports = OAuthLoginCommand;
