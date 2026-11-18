'use strict';

const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleDiscoveredSubjectsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleDiscoveredSubjectsListCommand);
		const subjects = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleDiscoveredSubjectsV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(subjects);
	}
}

ShuttleDiscoveredSubjectsListCommand.aliases = [
	'shuttle:discovered-subjects:list',
];
ShuttleDiscoveredSubjectsListCommand.description =
	`List discovered subjects for shuttle jobs ${SHUTTLE_PERMISSIONS}`;
ShuttleDiscoveredSubjectsListCommand.examples = [
	'box shuttle:discovered-subjects --job-id 6a315c0754833bfc5df067bf',
];
ShuttleDiscoveredSubjectsListCommand._endpoint =
	'get_shuttle_discovered_subjects';

ShuttleDiscoveredSubjectsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID whose discovered subjects to list',
		required: true,
	}),
};

module.exports = ShuttleDiscoveredSubjectsListCommand;
