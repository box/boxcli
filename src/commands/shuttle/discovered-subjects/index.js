'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttleDiscoveredSubjectsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			ShuttleDiscoveredSubjectsListCommand
		);

		const subjects = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleDiscoveredSubjectsV2026R0(
					pageQueryParams
				),
			{ jobId: flags['job-id'] }
		);
		await this.output(subjects);
	}
}

ShuttleDiscoveredSubjectsListCommand.aliases = [
	'shuttle:discovered-subjects:list',
];
ShuttleDiscoveredSubjectsListCommand.description =
	'List the users and groups discovered on the source system of a Box Shuttle job, with a suggested Box target when the scan inferred one';
ShuttleDiscoveredSubjectsListCommand.examples = [
	'box shuttle:discovered-subjects --job-id 6a3ba68e810d9156194530a1',
];
ShuttleDiscoveredSubjectsListCommand._endpoint =
	'get_shuttle_discovered_subjects';

ShuttleDiscoveredSubjectsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag(
		'ID of the shuttle job whose discovered subjects to list'
	),
};

module.exports = ShuttleDiscoveredSubjectsListCommand;
