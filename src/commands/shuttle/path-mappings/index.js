'use strict';

const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttlePathMappingsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttlePathMappingsListCommand);
		const mappings = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttlePathMappingsV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(mappings);
	}
}

ShuttlePathMappingsListCommand.aliases = ['shuttle:path-mappings:list'];
ShuttlePathMappingsListCommand.description = `List shuttle path mappings ${SHUTTLE_PERMISSIONS}`;
ShuttlePathMappingsListCommand.examples = [
	'box shuttle:path-mappings --job-id 6a315c0754833bfc5df067bf',
];
ShuttlePathMappingsListCommand._endpoint = 'get_shuttle_path_mappings';

ShuttlePathMappingsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID whose path mappings to list',
		required: true,
	}),
};

module.exports = ShuttlePathMappingsListCommand;
