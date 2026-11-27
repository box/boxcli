'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttleRunsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleRunsListCommand);

		const runs = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleRunsV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(runs);
	}
}

ShuttleRunsListCommand.aliases = ['shuttle:runs:list'];
ShuttleRunsListCommand.description = 'List the runs of a Box Shuttle job';
ShuttleRunsListCommand.examples = [
	'box shuttle:runs --job-id 6a3ba68e810d9156194530a1',
];
ShuttleRunsListCommand._endpoint = 'get_shuttle_runs';

ShuttleRunsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag('ID of the shuttle job whose runs to list'),
};

module.exports = ShuttleRunsListCommand;
