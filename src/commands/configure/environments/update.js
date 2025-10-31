'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('node:fs');
const BoxCLIError = require('../../../cli-error');
const utilities = require('../../../util');

class EnvironmentsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(EnvironmentsUpdateCommand);
		let environmentsObject = await this.getEnvironments();
		let environment =
			environmentsObject.environments[
				args.name || environmentsObject.default
			];

		if (!environment) {
			this.error('There is no environment with this name');
			return;
		}

		if (flags['config-file-path']) {
			let configObject;
			try {
				configObject = JSON.parse(
					fs.readFileSync(flags['config-file-path'], 'utf8')
				);
			} catch (error) {
				throw new BoxCLIError(
					`Could not read environment config file ${flags['config-file-path']}`,
					error
				);
			}

			utilities.validateConfigObject(configObject);

			if (
				!configObject.boxAppSettings.appAuth.privateKey &&
				!flags['private-key-path'] &&
				environment.hasInLinePrivateKey
			) {
				throw new BoxCLIError(
					'Environment must specify private key in config file or via --private-key-path'
				);
			}
			if (configObject.boxAppSettings.appAuth.privateKey) {
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

		await this.updateEnvironments(environmentsObject);
		await this.output(environment);
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsUpdateCommand.noClient = true;

EnvironmentsUpdateCommand.description = 'Update a Box environment';

EnvironmentsUpdateCommand.flags = {
	...BoxCommand.minFlags,
	'config-file-path': Flags.string({
		description: 'Provide a file path to configuration file',
		parse: utilities.parsePath,
	}),
	name: Flags.string({ description: 'New name of the environment' }),
	'private-key-path': Flags.string({
		description: 'Provide a file path to application private key',
		parse: utilities.parsePath,
	}),
	'user-id': Flags.string({
		description:
			'Store a default user ID to use with the session commands. A default user ID can be stored for each Box environment',
	}),
	'cache-tokens': Flags.boolean({
		description:
			'Enable token caching, which significantly improves performance. Run with --no-cache-tokens and then --cache-tokens if your application config updates are not reflected in your requests.',
		allowNo: true,
	}),
};

EnvironmentsUpdateCommand.args = {
	name: Args.string({
		name: 'name',
		required: false,
		hidden: false,
		description: 'The name of the environment',
	}),
};

module.exports = EnvironmentsUpdateCommand;
