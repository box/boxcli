/* eslint-disable promise/avoid-new, no-sync */

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
const http = require('http');
const { nanoid } = require('nanoid');

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(OAuthLoginCommand);
		const environmentsObj = await this.getEnvironments();
		const port = flags.port;
		const redirectUri = `http://localhost:${port}/callback`;

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

		const environmentName = flags.name;
		const newEnvironment = {
			clientId: answers.clientID,
			clientSecret: answers.clientSecret,
			name: environmentName,
			cacheTokens: true,
			authMethod: 'oauth20',
		};

		const sdk = new BoxSDK({
			clientID: answers.clientID,
			clientSecret: answers.clientSecret,
		});
		this._configureSdk(sdk);

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

				environmentsObj.environments[environmentName] = newEnvironment;
				environmentsObj.default = environmentName;
				await this.updateEnvironments(environmentsObj);

				const callbackHtmlPath = path.resolve(__dirname, '../logged-in.html');

				let html = fs.readFileSync(callbackHtmlPath, 'utf8');
				html = html.replace('example@box.com', user.login);
				res.send(html);

				this.info(chalk`{green Successfully logged in as ${user.login}!}`);
				this.info(
					chalk`{green New environment "${environmentName}" has been created and selected.}`
				);
				this.info(
					chalk`{green You are set up to make your first API call. Refer to the CLI commands library (https://github.com/box/boxcli#command-topics) for examples.}`
				);
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
			http.get(`http://localhost:${port}/callback?state=${authInfo.state}&code=${authInfo.code}`);
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

OAuthLoginCommand.description = 'Sign in with OAuth and set a new environment';

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
};

module.exports = OAuthLoginCommand;
