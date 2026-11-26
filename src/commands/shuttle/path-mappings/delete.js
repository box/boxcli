'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttlePathMappingsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttlePathMappingsDeleteCommand);
		await this.tsClient.shuttle.deleteShuttlePathMappingByIdV2026R0(
			args.id
		);
		this.info(`Deleted shuttle path mapping ${args.id}`);
	}
}

ShuttlePathMappingsDeleteCommand.description =
	'Permanently delete a Box Shuttle path mapping. Content that has already been migrated is not affected';
ShuttlePathMappingsDeleteCommand.examples = [
	'box shuttle:path-mappings:delete 6a3ba7a24ea17bc9461eeacd',
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
