'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttleJobSchedulesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleJobSchedulesListCommand);

		const schedules = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleJobSchedulesV2026R0(
					pageQueryParams
				),
			{ jobId: flags['job-id'] }
		);
		await this.output(schedules);
	}
}

ShuttleJobSchedulesListCommand.aliases = ['shuttle:job-schedules:list'];
ShuttleJobSchedulesListCommand.description =
	'List the schedules of a Box Shuttle job';
ShuttleJobSchedulesListCommand.examples = [
	'box shuttle:job-schedules --job-id 6a3ba68e810d9156194530a1',
];
ShuttleJobSchedulesListCommand._endpoint = 'get_shuttle_job_schedules';

ShuttleJobSchedulesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag('ID of the shuttle job whose schedules to list'),
};

module.exports = ShuttleJobSchedulesListCommand;
