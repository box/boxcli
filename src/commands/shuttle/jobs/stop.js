'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsStopCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsStopCommand);
		await this.tsClient.shuttle.createShuttleJobStopV2026R0(args.id);
	}
}

ShuttleJobsStopCommand.description = 'Stop a running shuttle job';
ShuttleJobsStopCommand.examples = [
	'box shuttle:jobs:stop 6a315c0754833bfc5df067bf',
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
