'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleSystemsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleSystemsDeleteCommand);
		await this.tsClient.shuttle.deleteShuttleSystemByIdV2026R0(args.id);
		this.info(`Deleted shuttle system ${args.id}`);
	}
}

ShuttleSystemsDeleteCommand.description = `Delete a shuttle system ${SHUTTLE_PERMISSIONS}`;
ShuttleSystemsDeleteCommand.examples = [
	'box shuttle:systems:delete 6a315c0754833bfc5df067bf',
];
ShuttleSystemsDeleteCommand._endpoint = 'delete_shuttle_systems_id';

ShuttleSystemsDeleteCommand.flags = {
	...BoxCommand.flags,
};

ShuttleSystemsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle system to delete',
	}),
};

module.exports = ShuttleSystemsDeleteCommand;
