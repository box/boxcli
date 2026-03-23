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
const inquirer = require('../inquirer');
const path = require('node:path');
const ora = require('ora');
const http = require('node:http');
const { nanoid } = require('nanoid');
const DEBUG = require('../debug');
const { generatePKCE } = require('../pkce-support');
const {
	assertValidOAuthCode,
	getTokenInfoByAuthCode,
} = require('../login-helper');

const GENERIC_OAUTH_CLIENT_ID = 'udz8zp4yue87uk9dzq4xk425kkwvqvh1';
const GENERIC_OAUTH_CLIENT_SECRET = 'iZ1MbvC3ZaF25nbJli7IsKdRHAxfu3fn';
const SUPPORTED_DEFAULT_APP_PORTS = [3000, 3001, 4000, 5000, 8080];
const DEFAULT_ENVIRONMENT_NAME = 'oauth';
const OAUTH_CALLBACK_TIMEOUT_MS = 5 * 60 * 1000;
const LOOPBACK_HOST = 'localhost';
const DEFAULT_OPEN_AUTHORIZE_IN_BROWSER = (
	openFn,
	apps,
	authorizeUrl,
	useIncognito
) => {
	if (useIncognito) {
		openFn(authorizeUrl, {
			newInstance: true,
			app: { name: apps.browserPrivate },
		});
	} else {
		openFn(authorizeUrl);
	}
};

let oauthCallbackTimeoutMs = OAUTH_CALLBACK_TIMEOUT_MS;
let openAuthorizeInBrowser = DEFAULT_OPEN_AUTHORIZE_IN_BROWSER;

async function promptForPlatformAppCredentials(inquirerModule, clientId) {
	if (!clientId) {
		const answer = await inquirerModule.prompt([
			{
				type: 'input',
				name: 'clientId',
				message: 'Enter the Client ID:',
			},
		]);
		clientId = answer.clientId.trim();
	}

	const { clientSecret } = await inquirerModule.prompt([
		{
			type: 'input',
			name: 'clientSecret',
			message: 'Enter the Client Secret:',
		},
	]);

	return {
		useDefaultBoxApp: false,
		clientId,
		clientSecret,
	};
}

async function promptForAuthMethod(inquirerModule) {
	const CLIENT_ID_MIN_LENGTH = 16;
	const CLIENT_ID_MAX_LENGTH = 99;

	while (true) {
		const { choice } = await inquirerModule.prompt([
			{
				type: 'input',
				name: 'choice',
				message:
					'How would you like to authenticate?\n[1] Log-in as a Box user (OAuth)\n[2] Use a Box Platform App\n[q] Quit\n? Enter 1, 2, or q:',
			},
		]);

		const trimmedChoice = typeof choice === 'string' ? choice.trim() : '';

		if (trimmedChoice === '1') {
			return {
				useDefaultBoxApp: true,
				clientId: GENERIC_OAUTH_CLIENT_ID,
				clientSecret: GENERIC_OAUTH_CLIENT_SECRET,
			};
		}

		if (trimmedChoice === '2') {
			return promptForPlatformAppCredentials(inquirerModule);
		}

		if (trimmedChoice.toLowerCase() === 'q') {
			return null;
		}

		if (
			trimmedChoice.length > CLIENT_ID_MIN_LENGTH &&
			trimmedChoice.length < CLIENT_ID_MAX_LENGTH
		) {
			return promptForPlatformAppCredentials(
				inquirerModule,
				trimmedChoice
			);
		}

		// Invalid input — repeat the prompt
	}
}

class OAuthLoginCommand extends BoxCommand {
	async run() {
		const openModule = await import('open');
		const open = openModule.default;
		const apps = openModule.apps;

		const { flags } = await this.parse(OAuthLoginCommand);
		const forceDefaultBoxApp = flags['default-box-app'];
		const forcePlatformApp = flags['platform-app'];
		let useDefaultBoxApp = false;
		const environmentsObject = await this.getEnvironments();
		const port = flags.port;
		const redirectUri = `http://${LOOPBACK_HOST}:${port}/callback`;
		const isUnsupportedDefaultAppPort = () =>
			useDefaultBoxApp && !SUPPORTED_DEFAULT_APP_PORTS.includes(port);
		let environment;

		if (this.flags.reauthorize) {
			let targetEnvName = this.flags.name;
			if (
				!Object.hasOwn(environmentsObject.environments, this.flags.name)
			) {
				const currentEnv =
					environmentsObject.environments[environmentsObject.default];
				if (
					this.flags.name === DEFAULT_ENVIRONMENT_NAME &&
					environmentsObject.default &&
					currentEnv?.authMethod === 'oauth20'
				) {
					targetEnvName = environmentsObject.default;
				} else {
					this.info(
						chalk`{red The "${this.flags.name}" environment does not exist}`
					);
					return;
				}
			}

			environment = environmentsObject.environments[targetEnvName];
			if (environment.authMethod !== 'oauth20') {
				this.info(
					chalk`{red The selected environment is not of type oauth20}`
				);
				return;
			}
			if (forceDefaultBoxApp) {
				useDefaultBoxApp = true;
				environment.clientId = GENERIC_OAUTH_CLIENT_ID;
				environment.clientSecret = GENERIC_OAUTH_CLIENT_SECRET;
			} else {
				useDefaultBoxApp =
					environment.clientId === GENERIC_OAUTH_CLIENT_ID &&
					environment.clientSecret === GENERIC_OAUTH_CLIENT_SECRET;
			}
		} else {
			useDefaultBoxApp = forceDefaultBoxApp;
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
		} else if (forcePlatformApp) {
			const answers = await promptForPlatformAppCredentials(inquirer);
			useDefaultBoxApp = false;

			environment = {
				clientId: answers.clientId,
				clientSecret: answers.clientSecret,
				name: this.flags.name,
				cacheTokens: true,
				authMethod: 'oauth20',
			};
		} else {
			const answers = await promptForAuthMethod(inquirer);
			if (answers === null) {
				return;
			}
			useDefaultBoxApp = answers.useDefaultBoxApp;

			environment = {
				clientId: answers.clientId,
				clientSecret: answers.clientSecret,
				name: this.flags.name,
				cacheTokens: true,
				authMethod: 'oauth20',
			};
		}

		if (isUnsupportedDefaultAppPort()) {
			this.info(
				chalk`{red Unsupported port "${port}" for the Official Box CLI app flow. Supported ports: ${SUPPORTED_DEFAULT_APP_PORTS.join(', ')}}`
			);
			return;
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
		let callbackHandled = false;

		// Keep run() blocked until callback flow completes.
		// This prevents command exit before the OAuth redirect returns.
		let resolveCallbackFlow;
		const callbackFlowDone = new Promise((resolve) => {
			resolveCallbackFlow = resolve;
		});
		let callbackTimeout;

		// Timeout and callback may race, so teardown must be idempotent.
		// This guard ensures cleanup and resolve happen only once.
		let callbackFlowResolved = false;

		let server;
		try {
			// Bind only to loopback to avoid exposing callback externally.
			// Browser redirect is local, so external interfaces are unnecessary.
			server = await new Promise((resolve, reject) => {
				const s = app.listen(port, LOOPBACK_HOST);
				s.once('listening', () => resolve(s));
				s.once('error', reject);
			});
		} catch (error) {
			if (error.code === 'EADDRINUSE') {
				throw new BoxCLIError(
					`Port ${port} is already in use. Please close the application using this port or use --port to specify a different port.`,
					error
				);
			}
			throw new BoxCLIError(
				`Failed to start local OAuth server on port ${port}: ${error.message}`,
				error
			);
		}

		const shutdownServer = () => {
			if (!server) {
				return;
			}
			server.close();
			if (typeof server.closeAllConnections === 'function') {
				server.closeAllConnections();
			}
		};

		// Use one finalize path so all exits apply the same cleanup.
		// This keeps timeout and callback completion behavior consistent.
		const finalizeCallbackFlow = () => {
			if (callbackFlowResolved) {
				return;
			}
			callbackFlowResolved = true;
			clearTimeout(callbackTimeout);
			shutdownServer();
			resolveCallbackFlow();
		};

		// Bound callback wait time to avoid hanging sessions forever.
		// If user abandons auth, the command exits predictably.
		callbackTimeout = setTimeout(() => {
			if (callbackHandled) {
				return;
			}
			this.info(
				chalk`{red Login timed out waiting for OAuth callback after ${oauthCallbackTimeoutMs / 1000} seconds.}`
			);
			finalizeCallbackFlow();
		}, oauthCallbackTimeoutMs);

		const state = nanoid(32);
		const pkce = useDefaultBoxApp ? generatePKCE() : null;

		app.get('/callback', async (request, res) => {
			// Reject replayed callbacks after a completion was already accepted.
			// This enforces single-use semantics for the local callback endpoint.
			if (callbackHandled) {
				res.status(409).send('OAuth callback already handled.');
				return;
			}

			callbackHandled = true;

			try {
				if (request.query.state !== state) {
					throw new BoxCLIError(
						`Invalid OAuth state received in callback. Got "${request.query.state}" while expecting "${state}"`
					);
				}
				assertValidOAuthCode(request.query.code);
				const tokenInfo = await getTokenInfoByAuthCode(
					sdk,
					request.query.code,
					redirectUri,
					pkce?.codeVerifier
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
				const statusCode =
					error?.response?.statusCode ?? error?.response?.status;
				const errorMessage =
					error?.response?.body?.error_description ||
					(statusCode
						? `Request failed with status ${statusCode}`
						: null) ||
					error?.message ||
					'Unknown error';
				DEBUG.execute('Login error: %O', error);
				this.info(chalk`{red Login failed: ${errorMessage}}`);
				res.status(500).send('Login failed. Please check the CLI output for details.');

			} finally {
				finalizeCallbackFlow();
			}
		});

		const spinner = ora({
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
				`http://${LOOPBACK_HOST}:${port}/callback?state=${authInfo.state}&code=${authInfo.code}`
			);
		} else {
			openAuthorizeInBrowser(
				open,
				apps,
				authorizeUrl,
				flags['incognito-browser']
			);
			this.info(
				useDefaultBoxApp
					? chalk`{yellow If authorization fails, verify that you are using one of the supported ports for the Official Box CLI app flow and restart the login command.}`
					: chalk`{yellow If you are redirected to the Files view, make sure your Redirect URI is configured correctly and restart the login command.}`
			);
		}
		await callbackFlowDone;
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
OAuthLoginCommand.noClient = true;

OAuthLoginCommand.description =
	'Sign in with OAuth 2.0 and create a new environment (or update an existing one with --reauthorize).\n' +
	'\n' +
	'Login options:\n' +
	'\n' +
	'  (1) Official Box CLI App\n' +
	'      No app setup needed. Use --default-box-app (-d) to skip the prompt.\n' +
	'\n' +
	'  (2) Your own Platform OAuth App\n' +
	'      Enter your Client ID and Client Secret when prompted. Use --platform-app to skip the prompt.\n' +
	'\n' +
	'Quickstart: run "box login -d" to sign in immediately. A browser window will open for authorization. Once access is granted, the environment is created and set as default — you can start running commands right away.';

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
		default: DEFAULT_ENVIRONMENT_NAME,
	}),
	port: Flags.integer({
		char: 'p',
		description: 'Set the port number for the local OAuth callback server',
		default: 3000,
	}),
	'default-box-app': Flags.boolean({
		char: 'd',
		description:
			'Use the Official Box CLI app flow and proceed directly to authorization.\n' +
			'This is the fastest way to integrate with Box — no app creation in the Developer Console is needed.\n' +
			'Scopes are limited to content actions, allowing you to effectively operate with your files and folders.\n' +
			'This flow requires a local callback server on a supported port (3000, 3001, 4000, 5000, or 8080). The default port is 3000; use --port to change it.',
		exclusive: ['platform-app'],
		default: false,
	}),
	'platform-app': Flags.boolean({
		description:
			'Skip the authentication method prompt and go directly to Platform App setup.\n' +
			'You will be prompted for Client ID and Client Secret.',
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
module.exports._test = {
	promptForAuthMethod,
	promptForPlatformAppCredentials,
	setOAuthCallbackTimeoutMs(timeoutMs) {
		oauthCallbackTimeoutMs = timeoutMs;
	},
	resetOAuthCallbackTimeoutMs() {
		oauthCallbackTimeoutMs = OAUTH_CALLBACK_TIMEOUT_MS;
	},
	setOpenAuthorizeInBrowser(fn) {
		openAuthorizeInBrowser = fn;
	},
	resetOpenAuthorizeInBrowser() {
		openAuthorizeInBrowser = DEFAULT_OPEN_AUTHORIZE_IN_BROWSER;
	},
};
