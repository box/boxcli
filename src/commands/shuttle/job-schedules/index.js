'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleJobSchedulesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleJobSchedulesListCommand);
		const schedules = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleJobSchedulesV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(schedules);
	}
}

ShuttleJobSchedulesListCommand.aliases = ['shuttle:job-schedules:list'];
ShuttleJobSchedulesListCommand.description = 'List shuttle job schedules';
ShuttleJobSchedulesListCommand.examples = [
	'box shuttle:job-schedules --job-id 6a315c0754833bfc5df067bf',
];
ShuttleJobSchedulesListCommand._endpoint = 'get_shuttle_job_schedules';

ShuttleJobSchedulesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID whose schedules to list',
		required: true,
	}),
};

module.exports = ShuttleJobSchedulesListCommand;
