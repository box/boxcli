'use strict';

const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');
const { Flags, Args } = require('@oclif/core');

class ShuttleSystemsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleSystemsUpdateCommand);
		const requestBody = {};

		if (flags.name) {
			requestBody.name = flags.name;
		}
		if (Object.keys(requestBody).length === 0) {
			this.error('Please provide at least one update flag.');
		}

		const system = await this.tsClient.shuttle.updateShuttleSystemByIdV2026R0(
			args.id,
			requestBody
		);
		await this.output(system.rawData ?? system);
	}
}

ShuttleSystemsUpdateCommand.description = `Update a shuttle system ${SHUTTLE_PERMISSIONS}`;
ShuttleSystemsUpdateCommand.examples = [
	'box shuttle:systems:update 6a315c0754833bfc5df067bf --name "NYC File Server (Primary)"',
];
ShuttleSystemsUpdateCommand._endpoint = 'put_shuttle_systems_id';

ShuttleSystemsUpdateCommand.flags = {
	...BoxCommand.flags,
	name: Flags.string({
		char: 'n',
		description: 'Updated display name for the shuttle system',
	}),
};

ShuttleSystemsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle system to update',
	}),
};

module.exports = ShuttleSystemsUpdateCommand;
