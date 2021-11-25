'use strict';

const BoxCommand = require('../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs');
const BoxSDK = require('box-node-sdk');
const BoxCLIError = require('../cli-error');
const CLITokenCache = require('../token-cache');
const chalk = require('chalk');
const open = require('open');
const express = require('express');
const inquirer = require('inquirer');
const path = require('path');
const ora = require('ora');

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(OAuthLoginCommand);
		const environmentsObj = this.getEnvironments();
		const port = flags.port;

		this.info(chalk`{yellow {bold Prerequisites:}}`);
		this.info(
			chalk`{yellow 1. Go to Developer Console (https://app.box.com/developers/console)\n   and create a custom app with OAuth authentication method.}`
		);
		this.info(
			chalk`{yellow 2. Click on Configuration tab and set the OAuth Redirect URI to:\n   http://localhost:${port}/callback}`
		);
		const answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'clientID',
				message: 'What is your client ID?',
			},
			{
				type: 'input',
				name: 'clientSecret',
				message: 'What is your client secret?',
			},
		]);

		const environmentName = flags.name;
		const newEnvironment = {
			clientId: answers.clientID,
			clientSecret: answers.clientSecret,
			name: environmentName,
			cacheTokens: true,
		};

		const sdk = new BoxSDK({
			clientID: answers.clientID,
			clientSecret: answers.clientSecret,
		});

		const app = express();
		let server;
		app.get('/callback', async (req, res) => {
			try {
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
				environmentsObj.environments[environmentName] = newEnvironment;
				environmentsObj.default = environmentName;
				this.updateEnvironments(environmentsObj);

				const client = sdk.getPersistentClient(tokenInfo, tokenCache);
				const user = await client.users.get('me');

				const callbackHtmlPath = path.resolve(__dirname, '../logged-in.html');

				let html = fs.readFileSync(callbackHtmlPath, 'utf8');
				html = html.replace('example@box.com', user.login);
				res.send(html);

				this.info(chalk`{green Successfully logged in as ${user.login}!}`);
				this.info(
					chalk`{green New environment "${environmentName}" has been created and selected.}`
				);
			} catch (err) {
				throw new BoxCLIError(err);
			} finally {
				server.close();
			}
		});
		server = app.listen(port);

		let spinner = ora({
			text: chalk`{bgCyan Opening browser for OAuth. Please click {bold Grant access to Box} to continue.}`,
			spinner: 'bouncingBall',
		}).start();

		await new Promise((resolve) => setTimeout(resolve, 1000));
		spinner.succeed();

		// the URL to redirect the user to
		const authorize_url = sdk.getAuthorizeURL({
			response_type: 'code',
		});

		open(authorize_url);
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
OAuthLoginCommand.noClient = true;

OAuthLoginCommand.description = 'Sign in with OAuth and set a new environment';

OAuthLoginCommand.flags = {
	...BoxCommand.minFlags,
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
};

module.exports = OAuthLoginCommand;
