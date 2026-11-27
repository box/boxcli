'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { runIdFlag } = require('../../../modules/shuttle');

class ShuttleReportsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleReportsListCommand);

		const reports = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleReportsV2026R0(pageQueryParams),
			{ runId: flags['run-id'] }
		);
		await this.output(reports);
	}
}

ShuttleReportsListCommand.aliases = ['shuttle:reports:list'];
ShuttleReportsListCommand.description =
	'List the reports generated for a Box Shuttle run';
ShuttleReportsListCommand.examples = [
	'box shuttle:reports --run-id 6a3ba68e810d9156194530a1:42',
];
ShuttleReportsListCommand._endpoint = 'get_shuttle_reports';

ShuttleReportsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'run-id': runIdFlag(
		'ID of the shuttle run whose reports to list, in the form <job_id>:<run_number>'
	),
};

module.exports = ShuttleReportsListCommand;
