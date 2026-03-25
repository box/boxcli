'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const _ = require('lodash');
const utilities = require('../../../util');

class EnvironmentsGetCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(EnvironmentsGetCommand);
		let environmentsObject = await this.getEnvironments();
		let environment;

		if (flags.current) {
			let currentEnvironment = environmentsObject.default;
			environment = environmentsObject.environments[currentEnvironment];
		} else if (flags.name) {
			environment = environmentsObject.environments[flags.name];
		} else {
			environment = environmentsObject.environments;
		}

		if (_.isEmpty(environment)) {
			this.error('No environment(s) exists');
		} else {
			await this.output(utilities.maskObjectValuesByKey(environment));
		}
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsGetCommand.noClient = true;
EnvironmentsGetCommand.aliases = ['configure:environments:list'];

EnvironmentsGetCommand.description =
	'Get a Box environment or list all configured Box environments.\nclientSecret values are masked in CLI output. To view full secrets, access secure storage directly (for example, macOS Keychain, Windows Credential Manager, or a supported Linux equivalent).';

EnvironmentsGetCommand.flags = {
	...BoxCommand.minFlags,
	current: Flags.boolean({
		char: 'c',
		description: 'Get the current default Box environment',
		exclusive: ['name'],
	}),
	name: Flags.string({
		char: 'n',
		description: 'Get a Box environment with this name',
		exclusive: ['current'],
	}),
};

module.exports = EnvironmentsGetCommand;
