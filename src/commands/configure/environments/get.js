'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const _ = require('lodash');

class EnvironmentsGetCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(EnvironmentsGetCommand);
		let environmentsObj = await this.getEnvironments();
		let environment;

		if (flags.current) {
			let currentEnv = environmentsObj.default;
			environment = environmentsObj.environments[currentEnv];
		} else if (flags.name) {
			environment = environmentsObj.environments[flags.name];
		} else {
			environment = environmentsObj.environments;
		}

		if (_.isEmpty(environment)) {
			this.error('No environment(s) exists');
		} else {
			await this.output(environment);
		}
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsGetCommand.noClient = true;

EnvironmentsGetCommand.description = 'Get a Box environment';

EnvironmentsGetCommand.flags = {
	...BoxCommand.minFlags,
	current: Flags.boolean({
		char: 'c',
		description: 'Get the current default Box environment',
		exclusive: ['name']
	}),
	name: Flags.string({
		char: 'n',
		description: 'Get a Box environment with this name',
		exclusive: ['current']
	})
};

module.exports = EnvironmentsGetCommand;
