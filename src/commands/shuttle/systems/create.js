'use strict';

const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');
const { Flags, Args } = require('@oclif/core');

class ShuttleSystemsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleSystemsCreateCommand);
		const requestBody = {
			name: args.name,
			systemType: flags['system-type'],
		};

		const system = await this.tsClient.shuttle.createShuttleSystemV2026R0(requestBody);
		await this.output(system.rawData ?? system);
	}
}

ShuttleSystemsCreateCommand.description =
	`Create a shuttle system (Windows agent systems only via public API) ${SHUTTLE_PERMISSIONS}`;
ShuttleSystemsCreateCommand.examples = [
	'box shuttle:systems:create "NYC File Server" --system-type windows',
];
ShuttleSystemsCreateCommand._endpoint = 'post_shuttle_systems';

ShuttleSystemsCreateCommand.flags = {
	...BoxCommand.flags,
	'system-type': Flags.string({
		description: 'System type. Only windows is supported through the public API.',
		options: ['windows'],
		required: true,
	}),
};

ShuttleSystemsCreateCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Display name for the new shuttle system',
	}),
};

module.exports = ShuttleSystemsCreateCommand;
