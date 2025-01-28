'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const inquirer = require('inquirer');

class EnvironmentsSetCurrentCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(EnvironmentsSetCurrentCommand);
		let environmentsObj = await this.getEnvironments();
		let name = args.name;

		if (!name) {
			let answers = await inquirer.prompt([
				{
					type: 'list',
					name: 'environment',
					message: 'Which environment?',
					choices: Object.keys(environmentsObj.environments),
				}
			]);
			name = answers.environment;
		}

		if (environmentsObj.environments.hasOwnProperty(name)) {
			environmentsObj.default = name;
			await this.updateEnvironments(environmentsObj);
			this.info(`The ${name} environment has been set as the default`);
		} else {
			this.error(`The ${name} environment does not exist`);
		}
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsSetCurrentCommand.noClient = true;

EnvironmentsSetCurrentCommand.aliases = [ 'configure:environments:select' ];
EnvironmentsSetCurrentCommand.description = 'Set your current Box environment to use';

EnvironmentsSetCurrentCommand.flags = {
	...BoxCommand.minFlags,
};

EnvironmentsSetCurrentCommand.args = {
	id: Args.string({
		name: 'name',
		required: false,
		hidden: false,
		description: 'Name of the environment'
	})
};

module.exports = EnvironmentsSetCurrentCommand;
