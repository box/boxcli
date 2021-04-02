"use strict";

const BoxCommand = require("../box-command");
const { flags } = require("@oclif/command");
const fs = require("fs");
const BoxSDK = require("box-node-sdk");
const BoxCLIError = require("../cli-error");
const CLITokenCache = require("../token-cache");
const chalk = require("chalk");
const utils = require("../util");
const open = require("open");
const express = require("express");
const inquirer = require("inquirer");
const path = require('path');

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(OAuthLoginCommand);
		let environmentsObj = this.getEnvironments();
		let answers = await inquirer.prompt([
			{
				type: "input",
				name: "clientID",
				message: "What is your client ID?",
			},
			{
				type: "input",
				name: "clientSecret",
				message: "What is your client secret?",
			},
		]);

		let environmentName = "oauth";
		let newEnvironment = {
			clientId: answers.clientID,
			clientSecret: answers.clientSecret,
			name: environmentName,
			cacheTokens: true,
		};

		let sdk = new BoxSDK({
			clientID: answers.clientID,
			clientSecret: answers.clientSecret,
		});

		let app = express();
		app.get("/callback", async (req, res) => {
			// Will print the OAuth auth code
			try {
				let tokenInfo = await sdk.getTokensAuthorizationCodeGrant(
					req.query.code,
					null
				);
				let tokenCache = new CLITokenCache(environmentName);
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
        let client = sdk.getPersistentClient(tokenInfo, tokenCache);
				let user = await client.users.get("me");
        let user_login = user.login;
				let callbackHtmlPath = path.resolve(__dirname, '../logged-in.html');
        let html = fs.readFileSync(callbackHtmlPath, 'utf8');
        html = html.replace("example@box.com", user.login);
				res.send(html);
				this.info(chalk`{green Successfully logged in as ${user_login}!}`);
				app.close();
			} catch (err) {
				throw new BoxCLIError(err);
			}
		});
		app = app.listen(3000);

		// the URL to redirect the user to
		var authorize_url = sdk.getAuthorizeURL({
			response_type: "code",
		});

		open(authorize_url);
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
OAuthLoginCommand.noClient = true;

OAuthLoginCommand.description =
	"Sign in with OAuth and set as default environment";

OAuthLoginCommand.flags = {
	...BoxCommand.minFlags,
};

// OAuthLoginCommand.args = [
// 	{
// 		name: 'path',
// 		required: true,
// 		hidden: false,
// 		description: 'Provide a file path to configuration file'
// 	}
// ];

module.exports = OAuthLoginCommand;
