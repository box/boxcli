'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleSystemsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleSystemsCreateCommand);
		const system = await this.tsClient.shuttle.createShuttleSystemV2026R0({
			name: args.name,
			systemType: flags['system-type'],
		});
		await this.output(system.rawData ?? system);
	}
}

ShuttleSystemsCreateCommand.description =
	'Create a Box Shuttle system. Only Windows agent systems can be created through the API; other system types are configured in the Shuttle application. Register the agent with a token from shuttle:systems:issue-registration-token';
ShuttleSystemsCreateCommand.examples = [
	'box shuttle:systems:create "Finance file server" --system-type windows',
];
ShuttleSystemsCreateCommand._endpoint = 'post_shuttle_systems';

ShuttleSystemsCreateCommand.flags = {
	...BoxCommand.flags,
	'system-type': Flags.string({
		description:
			'Type of the new system. One of: windows (the only type the API supports today)',
		options: ['windows'],
		required: true,
	}),
};

ShuttleSystemsCreateCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Display name of the shuttle system',
	}),
};

module.exports = ShuttleSystemsCreateCommand;
