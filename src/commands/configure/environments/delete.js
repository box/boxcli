'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const BoxCLIError = require('../../../cli-error');
const inquirer = require('inquirer');

class EnvironmentsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(EnvironmentsDeleteCommand);
		let environmentsObj = await this.getEnvironments();
		let name = args.name;

		if (!name) {
			const choices = Object.keys(environmentsObj.environments);
			if (choices.length === 0) {
				throw new BoxCLIError('No environments to delete');
			}
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
			delete environmentsObj.environments[name];
			if (environmentsObj.default === name) {
				environmentsObj.default = '';
			}
			await this.updateEnvironments(environmentsObj);
			this.info(`The ${name} environment was deleted`);
		} else {
			this.error(`The ${name} environment does not exist`);
		}
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsDeleteCommand.noClient = true;

EnvironmentsDeleteCommand.description = 'Delete a Box environment';

EnvironmentsDeleteCommand.flags = {
	...BoxCommand.minFlags,
};

EnvironmentsDeleteCommand.args = {
	name: Args.string({
		name: 'name',
		required: false,
		hidden: false,
		description: 'Name of the environment'
	})
};

module.exports = EnvironmentsDeleteCommand;
