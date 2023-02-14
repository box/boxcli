/* eslint-disable promise/avoid-new, no-sync */

'use strict';

const BoxCommand = require('../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs');
const BoxSDK = require('box-node-sdk');
const BoxCLIError = require('../cli-error');
const CLITokenCache = require('../token-cache');
const pkg = require('../../package.json');
const chalk = require('chalk');
const open = require('open');
const express = require('express');
const inquirer = require('inquirer');
const path = require('path');
const ora = require('ora');
const http = require('http');
const { nanoid } = require('nanoid');

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(OAuthLoginCommand);
		const environmentsObj = await this.getEnvironments();
		const port = flags.port;
		const redirectUri = `http://localhost:${port}/callback`;
		let environment;

		if (this.flags.reauthorize) {
			if (
				!environmentsObj.environments.hasOwnProperty(this.flags.name)
			) {
				this.error(`The ${this.flags.name} environment does not exist`);
			}

			environment = environmentsObj.environments[this.flags.name];
			if (environment.authMethod !== 'oauth20') {
				this.error('The selected environment is not of type oauth20');
			}
		} else {
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

			const answers = await inquirer.prompt([
				{
					type: 'input',
					name: 'clientID',
					message: 'What is the OAuth Client ID of your application?',
				},
				{
					type: 'input',
					name: 'clientSecret',
					message: 'What is the OAuth Client Secret of your application?',
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
				version: pkg.version,
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

		app.get('/callback', async(req, res) => {
			try {
				if (req.query.state !== state) {
					throw new BoxCLIError(
						`Invalid OAuth state received in callback. Got "${req.query.state}" while expecting "${state}"`
					);
				}
				const tokenInfo = await sdk.getTokensAuthorizationCodeGrant(
					req.query.code,
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

				environmentsObj.environments[environmentName] = environment;
				environmentsObj.default = environmentName;
				await this.updateEnvironments(environmentsObj);

				const callbackHtmlPath = path.resolve(__dirname, '../logged-in.html');

				let html = fs.readFileSync(callbackHtmlPath, 'utf8');
				html = html.replace('example@box.com', user.login);
				res.send(html);

				this.info(chalk`{green Successfully logged in as ${user.login}!}`);
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
			} catch (err) {
				throw new BoxCLIError(err);
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
			open(authorizeUrl);
			this.info(
				chalk`{yellow If you are redirect to files view, please make sure that your Redirect URI is set up correctly and restart the login command.}`
			);
		}
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
OAuthLoginCommand.noClient = true;

OAuthLoginCommand.description =
	'Sign in with OAuth and set a new environment or update an existing if reauthorize flag is used';

OAuthLoginCommand.flags = {
	...BoxCommand.minFlags,
	code: flags.boolean({
		char: 'c',
		description: 'Manually visit authorize URL and input code',
		default: false,
	}),
	name: flags.string({
		char: 'n',
		description: 'Set a name for the environment',
		default: 'oauth',
	}),
	port: flags.integer({
		char: 'p',
		description: 'Set the port number for the local OAuth callback server',
		default: 3000,
	}),
	reauthorize: flags.boolean({
		char: 'r',
		description: 'Reauthorize the existing environment with given `name`',
		dependsOn: ['name'],
		default: false
	}),
};

module.exports = OAuthLoginCommand;
