'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleJobsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsGetCommand);
		const job = await this.tsClient.shuttle.getShuttleJobByIdV2026R0(args.id);
		await this.output(job.rawData ?? job);
	}
}

ShuttleJobsGetCommand.description = `Get a shuttle job by ID ${SHUTTLE_PERMISSIONS}`;
ShuttleJobsGetCommand.examples = ['box shuttle:jobs:get 6a315c0754833bfc5df067bf'];
ShuttleJobsGetCommand._endpoint = 'get_shuttle_jobs_id';

ShuttleJobsGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttleJobsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job',
	}),
};

module.exports = ShuttleJobsGetCommand;
