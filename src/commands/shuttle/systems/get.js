'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleSystemsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleSystemsGetCommand);
		const system = await this.tsClient.shuttle.getShuttleSystemByIdV2026R0(args.id);
		await this.output(system.rawData ?? system);
	}
}

ShuttleSystemsGetCommand.description = 'Get a shuttle system by ID';
ShuttleSystemsGetCommand.examples = ['box shuttle:systems:get 6a315c0754833bfc5df067bf'];
ShuttleSystemsGetCommand._endpoint = 'get_shuttle_systems_id';

ShuttleSystemsGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttleSystemsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle system',
	}),
};

module.exports = ShuttleSystemsGetCommand;
