'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttlePathMappingsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttlePathMappingsGetCommand);
		const mapping = await this.tsClient.shuttle.getShuttlePathMappingByIdV2026R0(
			args.id
		);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttlePathMappingsGetCommand.description = `Get a shuttle path mapping by ID ${SHUTTLE_PERMISSIONS}`;
ShuttlePathMappingsGetCommand.examples = [
	'box shuttle:path-mappings:get 6a315c0754833bfc5df067bf',
];
ShuttlePathMappingsGetCommand._endpoint = 'get_shuttle_path_mappings_id';

ShuttlePathMappingsGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttlePathMappingsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle path mapping',
	}),
};

module.exports = ShuttlePathMappingsGetCommand;
