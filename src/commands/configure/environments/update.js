'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs');
const BoxCLIError = require('../../../cli-error');
const utils = require('../../../util');

class EnvironmentsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(EnvironmentsUpdateCommand);
		let environmentsObj = this.getEnvironments();
		let environment = environmentsObj.environments[args.name || environmentsObj.default];

		if (!environment) {
			this.error('There is no environment with this name');
			return;
		}

		if (flags['config-file-path']) {
			let configObj;
			try {
				/* eslint-disable no-sync */
				configObj = JSON.parse(fs.readFileSync(flags['config-file-path'], 'utf8'));
				/* eslint-enable no-sync */
			} catch (ex) {
				throw new BoxCLIError(`Could not read environment config file ${flags['config-file-path']}`, ex);
			}

			utils.validateConfigObject(configObj);

			if (!configObj.boxAppSettings.appAuth.privateKey && !flags['private-key-path'] && environment.hasInLinePrivateKey) {
				throw new BoxCLIError('Environment must specify private key in config file or via --private-key-path');
			}
			if (configObj.boxAppSettings.appAuth.privateKey) {
				environment.privateKeyPath = '';
				environment.hasInLinePrivateKey = true;
			}
			environment.boxConfigFilePath = flags['config-file-path'];
		}
		if (flags.name) {
			environment.name = flags.name;
		}
		if (flags['private-key-path']) {
			environment.privateKeyPath = flags['private-key-path'];
			environment.hasInLinePrivateKey = false;
		}
		if (flags['user-id']) {
			environment.defaultAsUserId = flags['user-id'];
			environment.useDefaultAsUser = true;
		}

		if (flags.hasOwnProperty('cache-tokens')) {
			environment.cacheTokens = flags['cache-tokens'];
		}

		this.updateEnvironments(environmentsObj);
		await this.output(environment);
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsUpdateCommand.noClient = true;

EnvironmentsUpdateCommand.description = 'Update a Box environment';

EnvironmentsUpdateCommand.flags = {
	...BoxCommand.minFlags,
	'config-file-path': flags.string({
		description: 'Provide a file path to configuration file',
		parse: utils.parsePath,
	}),
	name: flags.string({ description: 'New name of the environment' }),
	'private-key-path': flags.string({
		description: 'Provide a file path to application private key',
		parse: utils.parsePath,
	}),
	'user-id': flags.string({ description: 'Store a default user ID to use with the session commands. A default user ID can be stored for each Box environment' }),
	'cache-tokens': flags.boolean({
		description: 'Enable token caching, which significantly improves performance',
		allowNo: true,
	}),
};

EnvironmentsUpdateCommand.args = [
	{
		name: 'name',
		required: false,
		hidden: false,
		description: 'The name of the environment'
	}
];

module.exports = EnvironmentsUpdateCommand;
