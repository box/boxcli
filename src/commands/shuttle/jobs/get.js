'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsGetCommand);
		const job = await this.tsClient.shuttle.getShuttleJobByIdV2026R0(
			args.id
		);
		await this.output(job.rawData ?? job);
	}
}

ShuttleJobsGetCommand.description =
	'Get a Box Shuttle job, including its state, mapping-preparation state (mapping_state) and source system';
ShuttleJobsGetCommand.examples = [
	'box shuttle:jobs:get 6a3ba68e810d9156194530a1',
];
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
