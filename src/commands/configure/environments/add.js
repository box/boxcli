'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs');
const BoxCLIError = require('../../../cli-error');
const chalk = require('chalk');
const utils = require('../../../util');

class EnvironmentsAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(EnvironmentsAddCommand);
		let environmentsObj = await this.getEnvironments();
		let environmentName = flags.name;
		let configFilePath = utils.parsePath(args.path);
		let configObj;
		try {
			/* eslint-disable no-sync */
			configObj = JSON.parse(fs.readFileSync(configFilePath));
			/* eslint-enable no-sync */
		} catch (ex) {
			throw new BoxCLIError(`Could not read environment config file ${args.path}`, ex);
		}

		utils.validateConfigObject(configObj);

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
			throw new BoxCLIError('Your configuration file is missing the client secret');
		}
		if (!configObj.boxAppSettings.appAuth.publicKeyID) {
			throw new BoxCLIError('Your configuration file is missing the public key ID');
		}
		if (!configObj.boxAppSettings.appAuth.privateKey && !flags['private-key-path']) {
			throw new BoxCLIError('Your environment does not have a private key');
		}
		if (!configObj.boxAppSettings.appAuth.passphrase) {
			throw new BoxCLIError('Your environment does not have a passphrase');
		}
		if (!configObj.enterpriseID) {
			throw new BoxCLIError('Your environment does not have an enterprise ID');
		}

		if (flags['private-key-path']) {
			/* eslint-disable no-sync */
			if (!fs.existsSync(flags['private-key-path']) || fs.statSync(flags['private-key-path']).isDirectory()) {
				throw new BoxCLIError(`The private key path ${flags['private-key-path']} does not point to a file`);
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

		if (flags['ccg-auth']) {
			newEnvironment.clientSecret = configObj.boxAppSettings.clientSecret;
		}

		environmentsObj.environments[environmentName] = newEnvironment;
		await this.updateEnvironments(environmentsObj);
		this.info(chalk`{green Successfully added CLI environment "${flags.name}"}`);
	}
}

// @NOTE: This command MUST skip client setup, since it is used to add the first environment
EnvironmentsAddCommand.noClient = true;

EnvironmentsAddCommand.description = 'Add a new Box environment';

EnvironmentsAddCommand.flags = {
	...BoxCommand.minFlags,
	'private-key-path': flags.string({
		description: 'Provide a path to application private key',
		parse: utils.parsePath,
	}),
	'set-as-current': flags.boolean({ description: 'Set this new environment as your current environment' }),
	name: flags.string({
		char: 'n',
		description: 'Set a name for the environment',
		default: 'default',
	}),
	'ccg-auth': flags.boolean({
		description: 'Add a CCG environment',
	}),	
};

EnvironmentsAddCommand.args = [
	{
		name: 'path',
		required: true,
		hidden: false,
		description: 'Provide a file path to configuration file'
	}
];

module.exports = EnvironmentsAddCommand;
