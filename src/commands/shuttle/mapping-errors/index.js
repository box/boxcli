'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttleMappingErrorsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleMappingErrorsListCommand);

		const errors = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleMappingErrorsV2026R0(
					pageQueryParams
				),
			{ jobId: flags['job-id'] }
		);
		await this.output(errors);
	}
}

ShuttleMappingErrorsListCommand.aliases = ['shuttle:mapping-errors:list'];
ShuttleMappingErrorsListCommand.description =
	'List the mapping errors of a Box Shuttle job. Only the latest record of each error is returned; revision names the mapping revision that produced it. Import row problems have category path_import or subject_import';
ShuttleMappingErrorsListCommand.examples = [
	'box shuttle:mapping-errors --job-id 6a3ba68e810d9156194530a1',
];
ShuttleMappingErrorsListCommand._endpoint = 'get_shuttle_mapping_errors';

ShuttleMappingErrorsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag('ID of the shuttle job whose mapping errors to list'),
};

module.exports = ShuttleMappingErrorsListCommand;
