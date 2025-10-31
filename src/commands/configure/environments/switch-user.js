'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const chalk = require('chalk');

class EnvironmentsSwitchUserCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(EnvironmentsSwitchUserCommand);

		let environmentsObj = await this.getEnvironments();
		let environment = environmentsObj.environments[environmentsObj.default];

		if (flags.default && !args.userID) {
			environment.useDefaultAsUser = false;
		} else if (args.userID && !flags.default) {
			environment.useDefaultAsUser = true;
			environment.defaultAsUserId = args.userID;
		} else {
			throw new Error(
				'Either a userID argument or --default flag must be passed, but not both'
			);
		}

		await this.updateEnvironments(environmentsObj);
		this.info(chalk`{green User set to ${args.userID || 'default'}}`);
	}
}

// @NOTE: This command does not require a client to be set up
EnvironmentsSwitchUserCommand.noClient = true;

EnvironmentsSwitchUserCommand.description =
	'Switch the default Box user to run commands as';

EnvironmentsSwitchUserCommand.flags = {
	...BoxCommand.minFlags,
};

EnvironmentsSwitchUserCommand.args = {
	userID: Args.string({
		name: 'userID',
		hidden: false,
		required: false,
		description: 'The user ID to switch to',
	}),
};

EnvironmentsSwitchUserCommand.flags = {
	...BoxCommand.flags,
	default: Flags.boolean({
		description: 'Switch to the default user, i.e. the Service Account',
	}),
};

module.exports = EnvironmentsSwitchUserCommand;
