'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('fs');
const BoxCLIError = require('../../../cli-error');
const chalk = require('chalk');
const utils = require('../../../util');

class EnvironmentsAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(EnvironmentsAddCommand);
		let environmentsObj = await this.getEnvironments();
		let environmentName = flags.name;
		let configFilePath = utils.parsePath(args.path);
		let configObj;
		try {
			/* eslint-disable no-sync */
			configObj = JSON.parse(fs.readFileSync(configFilePath));
			/* eslint-enable no-sync */
		} catch (ex) {
			throw new BoxCLIError(
				`Could not read environment config file ${args.path}`,
				ex
			);
		}

		const isCCG = flags['ccg-auth'];

		utils.validateConfigObject(configObj, isCCG);

		let newEnvironment = {
			clientId: configObj.boxAppSettings.clientID,
			enterpriseId: configObj.enterpriseID,
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

		if (environmentsObj.environments.hasOwnProperty(environmentName)) {
			throw new BoxCLIError('There already is an environment with this name');
		}
		if (!configObj.boxAppSettings.clientID) {
			throw new BoxCLIError('Your configuration file is missing the client ID');
		}
		if (!configObj.boxAppSettings.clientSecret) {
			throw new BoxCLIError(
				'Your configuration file is missing the client secret'
			);
		}
		if (!isCCG) {
			if (!configObj.boxAppSettings.appAuth.publicKeyID) {
				throw new BoxCLIError(
					'Your configuration file is missing the public key ID'
				);
			}
			if (
				!configObj.boxAppSettings.appAuth.privateKey &&
				!flags['private-key-path']
			) {
				throw new BoxCLIError('Your environment does not have a private key');
			}
			if (!configObj.boxAppSettings.appAuth.passphrase) {
				throw new BoxCLIError('Your environment does not have a passphrase');
			}
		}
		if (!configObj.enterpriseID) {
			throw new BoxCLIError('Your environment does not have an enterprise ID');
		}

		if (flags['private-key-path']) {
			/* eslint-disable no-sync */
			if (
				!fs.existsSync(flags['private-key-path']) ||
				fs.statSync(flags['private-key-path']).isDirectory()
			) {
				throw new BoxCLIError(
					`The private key path ${flags['private-key-path']} does not point to a file`
				);
			}
			/* eslint-enable no-sync */
			newEnvironment.privateKeyPath = flags['private-key-path'];
			newEnvironment.hasInLinePrivateKey = false;
		}
		if (flags['set-as-current']) {
			configObj.default = args.name;
		}
		// If no default environment is defined, this newly added environment will be set as the default
		if (!environmentsObj.default) {
			environmentsObj.default = environmentName;
		}

		if (isCCG) {
			newEnvironment.clientSecret = configObj.boxAppSettings.clientSecret;
			newEnvironment.ccgUser = flags['ccg-user'];
			newEnvironment.authMethod = 'ccg';
		}

		environmentsObj.environments[environmentName] = newEnvironment;
		await this.updateEnvironments(environmentsObj);
		this.info(
			chalk`{green Successfully added CLI environment "${flags.name}"}`
		);
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
EnvironmentsAddCommand.noClient = true;

EnvironmentsAddCommand.description = 'Add a new Box environment';

EnvironmentsAddCommand.flags = {
	...BoxCommand.minFlags,
	'private-key-path': Flags.string({
		description: 'Provide a path to application private key',
		parse: utils.parsePath,
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
		description: 'Add a CCG environment that will use service account. You will have to provide enterprise ID with client id and secret.',
	}),
	'ccg-user': Flags.string({
		description: 'Provide an ID for a user for CCG. Use it to obtain user token. ' +
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
		description: 'Provide a file path to configuration file',
	}),
};

module.exports = EnvironmentsAddCommand;
