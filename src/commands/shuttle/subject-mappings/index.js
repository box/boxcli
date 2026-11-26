'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttleSubjectMappingsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleSubjectMappingsListCommand);

		const mappings = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleSubjectMappingsV2026R0(
					pageQueryParams
				),
			{ jobId: flags['job-id'] }
		);
		await this.output(mappings);
	}
}

ShuttleSubjectMappingsListCommand.aliases = ['shuttle:subject-mappings:list'];
ShuttleSubjectMappingsListCommand.description =
	'List the subject (user and group) mappings of a Box Shuttle job';
ShuttleSubjectMappingsListCommand.examples = [
	'box shuttle:subject-mappings --job-id 6a3ba68e810d9156194530a1',
];
ShuttleSubjectMappingsListCommand._endpoint = 'get_shuttle_subject_mappings';

ShuttleSubjectMappingsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag('ID of the shuttle job whose subject mappings to list'),
};

module.exports = ShuttleSubjectMappingsListCommand;
