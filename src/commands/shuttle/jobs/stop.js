'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsStopCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsStopCommand);
		await this.tsClient.shuttle.createShuttleJobStopV2026R0(args.id);
		this.info(`Accepted stop of shuttle job ${args.id}`);
	}
}

ShuttleJobsStopCommand.description =
	'Stop a running Box Shuttle job. Work already in progress finishes before the job reaches the stopped state';
ShuttleJobsStopCommand.examples = [
	'box shuttle:jobs:stop 6a3ba68e810d9156194530a1',
];
ShuttleJobsStopCommand._endpoint = 'post_shuttle_jobs_id_stop';

ShuttleJobsStopCommand.flags = {
	...BoxCommand.flags,
};

ShuttleJobsStopCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job to stop',
	}),
};

module.exports = ShuttleJobsStopCommand;
