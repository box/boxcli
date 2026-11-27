'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsStartCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobsStartCommand);

		await (Object.hasOwn(flags, 'mode') ? this.tsClient.shuttle.createShuttleJobStartV2026R0(args.id, {
				requestBody: { mode: flags.mode },
			}) : this.tsClient.shuttle.createShuttleJobStartV2026R0(args.id));
		this.info(`Accepted start of shuttle job ${args.id}`);
	}
}

ShuttleJobsStartCommand.description =
	'Start a Box Shuttle job in the given mode. The API accepts the request and starts the job asynchronously; follow it with shuttle:runs';
ShuttleJobsStartCommand.examples = [
	'box shuttle:jobs:start 6a3ba68e810d9156194530a1',
	'box shuttle:jobs:start 6a3ba68e810d9156194530a1 --mode transfer',
];
ShuttleJobsStartCommand._endpoint = 'post_shuttle_jobs_id_start';

ShuttleJobsStartCommand.flags = {
	...BoxCommand.flags,
	mode: Flags.string({
		description:
			'Run mode. One of: transfer, simulation, scan, analysis. The API uses simulation when omitted',
		options: ['transfer', 'simulation', 'scan', 'analysis'],
	}),
};

ShuttleJobsStartCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job to start',
	}),
};

module.exports = ShuttleJobsStartCommand;
