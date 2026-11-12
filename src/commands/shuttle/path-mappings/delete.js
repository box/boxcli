'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttlePathMappingsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttlePathMappingsDeleteCommand);
		await this.tsClient.shuttle.deleteShuttlePathMappingByIdV2026R0(args.id);
		this.info(`Deleted shuttle path mapping ${args.id}`);
	}
}

ShuttlePathMappingsDeleteCommand.description = `Delete a shuttle path mapping ${SHUTTLE_PERMISSIONS}`;
ShuttlePathMappingsDeleteCommand.examples = [
	'box shuttle:path-mappings:delete 6a315c0754833bfc5df067bf',
];
ShuttlePathMappingsDeleteCommand._endpoint = 'delete_shuttle_path_mappings_id';

ShuttlePathMappingsDeleteCommand.flags = {
	...BoxCommand.flags,
};

ShuttlePathMappingsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle path mapping to delete',
	}),
};

module.exports = ShuttlePathMappingsDeleteCommand;
