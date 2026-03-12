'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('node:fs');
const BoxCLIError = require('../../../cli-error');
const chalk = require('chalk');
const utilities = require('../../../util');

class EnvironmentsAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(EnvironmentsAddCommand);
		let environmentsObject = await this.getEnvironments();
		let environmentName = flags.name;
		let configFilePath = utilities.parsePath(args.path);
		let configObject;
		try {
			configObject = JSON.parse(fs.readFileSync(configFilePath));
		} catch (error) {
			throw new BoxCLIError(
				`Could not read environment config file ${args.path}`,
				error
			);
		}

		const isCCG = flags['ccg-auth'];

		utilities.validateConfigObject(configObject, isCCG);

		let newEnvironment = {
			clientId: configObject.boxAppSettings.clientID,
			enterpriseId: configObject.enterpriseID,
			boxConfigFilePath: configFilePath,
			hasInLinePrivateKey: true,
			privateKeyPath: null,
			name: environmentName,
			defaultAsUserId: null,
			useDefaultAsUser: false,
			// @NOTE: These are legacy properties no longer in use
			// adminAsUserId: null,
			// tempAsUserId: null,
			// useTempAsUser: false,
			// userSessionExpiration: null,
			// userSessionEnabled: false,
			cacheTokens: true,
		};

		if (Object.hasOwn(environmentsObject.environments, environmentName)) {
			throw new BoxCLIError(
				'There already is an environment with this name'
			);
		}
		if (!configObject.boxAppSettings.clientID) {
			throw new BoxCLIError(
				'Your configuration file is missing the client ID'
			);
		}
		if (!configObject.boxAppSettings.clientSecret) {
			throw new BoxCLIError(
				'Your configuration file is missing the client secret'
			);
		}
		if (!isCCG) {
			if (!configObject.boxAppSettings.appAuth.publicKeyID) {
				throw new BoxCLIError(
					'Your configuration file is missing the public key ID'
				);
			}
			if (
				!configObject.boxAppSettings.appAuth.privateKey &&
				!flags['private-key-path']
			) {
				throw new BoxCLIError(
					'Your environment does not have a private key'
				);
			}
			if (!configObject.boxAppSettings.appAuth.passphrase) {
				throw new BoxCLIError(
					'Your environment does not have a passphrase'
				);
			}
		}
		if (!configObject.enterpriseID) {
			throw new BoxCLIError(
				'Your environment does not have an enterprise ID'
			);
		}

		if (flags['private-key-path']) {
			if (
				!fs.existsSync(flags['private-key-path']) ||
				fs.statSync(flags['private-key-path']).isDirectory()
			) {
				throw new BoxCLIError(
					`The private key path ${flags['private-key-path']} does not point to a file`
				);
			}

			newEnvironment.privateKeyPath = flags['private-key-path'];
			newEnvironment.hasInLinePrivateKey = false;
		}
		if (flags['set-as-current']) {
			environmentsObject.default = environmentName;
		}

		// If no default environment is defined, this newly added environment will be set as the default
		if (!environmentsObject.default) {
			environmentsObject.default = environmentName;
		}

		if (isCCG) {
			newEnvironment.clientSecret =
				configObject.boxAppSettings.clientSecret;
			newEnvironment.ccgUser = flags['ccg-user'];
			newEnvironment.authMethod = 'ccg';
		}

		environmentsObject.environments[environmentName] = newEnvironment;
		await this.updateEnvironments(environmentsObject);
		this.info(
			chalk`{green Successfully added CLI environment "${flags.name}"}`
		);
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
EnvironmentsAddCommand.noClient = true;

EnvironmentsAddCommand.description =
	'Add a new Box environment from a Box app config file (JWT or CCG).\n' +
	'Open your application in Box Developer Console to get/create config data:\n' +
	'https://cloud.app.box.com/developers/console\n' +
	'\n' +
	'For OAuth (an alternative to server-side auth), add environment with: box login.\n' +
	'Quick start: box login -d (logs the user in via the Box Official CLI App).';
EnvironmentsAddCommand.examples = [
	'box configure:environments:add ~/Downloads/my_app_config.json',
	'box configure:environments:add ./config.json --name production --set-as-current',
	'box configure:environments:add ./config.json --ccg-auth --name ci-bot',
];

EnvironmentsAddCommand.flags = {
	...BoxCommand.minFlags,
	'private-key-path': Flags.string({
		description: 'Provide a path to application private key',
		parse: utilities.parsePath,
	}),
	'set-as-current': Flags.boolean({
		description: 'Set this new environment as your current environment',
	}),
	name: Flags.string({
		char: 'n',
		description: 'Set a name for the environment',
		default: 'default',
	}),
	'ccg-auth': Flags.boolean({
		description:
			'Add a CCG environment that will use a service account.\n' +
			'Open your application in Box Developer Console and create this config JSON yourself.\n' +
			'Required fields: boxAppSettings.clientID, boxAppSettings.clientSecret, enterpriseID.',
	}),
	'ccg-user': Flags.string({
		description:
			'Provide an ID for a user for CCG. Use it to obtain user token. ' +
			'In order to enable generating user token you have to go to your application ' +
			'configuration that can be found here https://app.box.com/developers/console.\n' +
			'In`Configuration` tab, in section `Advanced Features` select `Generate user access tokens`. \n' +
			'Do not forget to re-authorize application if it was already authorized.',
		dependsOn: ['ccg-auth'],
	}),
};

EnvironmentsAddCommand.args = {
	path: Args.string({
		name: 'path',
		required: true,
		hidden: false,
		description:
			'Path to the Box app configuration JSON file.\n' +
			'JWT: download this file from your application in Developer Console:\n' +
			'https://cloud.app.box.com/developers/console\n' +
			'CCG: create this JSON file yourself using values from your application\n' +
			'in Developer Console (Client ID and Client Secret from Configuration tab,\n' +
			'Enterprise ID from General Settings tab).',
	}),
};

module.exports = EnvironmentsAddCommand;
