'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleJobsListCommand extends BoxCommand {
	async run() {
		await this.parse(ShuttleJobsListCommand);
		const jobs = await this.markerPagination((pageQueryParams) =>
			this.tsClient.shuttle.getShuttleJobsV2026R0(pageQueryParams)
		);
		await this.output(jobs);
	}
}

ShuttleJobsListCommand.aliases = ['shuttle:jobs:list'];
ShuttleJobsListCommand.description = 'List shuttle jobs';
ShuttleJobsListCommand.examples = ['box shuttle:jobs'];
ShuttleJobsListCommand._endpoint = 'get_shuttle_jobs';

ShuttleJobsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

module.exports = ShuttleJobsListCommand;
