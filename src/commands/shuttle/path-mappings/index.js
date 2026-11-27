'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttlePathMappingsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttlePathMappingsListCommand);

		const mappings = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttlePathMappingsV2026R0(
					pageQueryParams
				),
			{ jobId: flags['job-id'] }
		);
		await this.output(mappings);
	}
}

ShuttlePathMappingsListCommand.aliases = ['shuttle:path-mappings:list'];
ShuttlePathMappingsListCommand.description =
	'List the path mappings of a Box Shuttle job';
ShuttlePathMappingsListCommand.examples = [
	'box shuttle:path-mappings --job-id 6a3ba68e810d9156194530a1',
];
ShuttlePathMappingsListCommand._endpoint = 'get_shuttle_path_mappings';

ShuttlePathMappingsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag('ID of the shuttle job whose path mappings to list'),
};

module.exports = ShuttlePathMappingsListCommand;
