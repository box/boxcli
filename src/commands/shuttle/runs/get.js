'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleRunsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleRunsGetCommand);
		const run = await this.tsClient.shuttle.getShuttleRunByIdV2026R0(
			args.id
		);
		await this.output(run.rawData ?? run);
	}
}

ShuttleRunsGetCommand.description =
	'Get a Box Shuttle run, including its mode, state, timing, transfer statistics and the report sections that can be requested for it';
ShuttleRunsGetCommand.examples = [
	'box shuttle:runs:get 6a3ba68e810d9156194530a1:42',
];
ShuttleRunsGetCommand._endpoint = 'get_shuttle_runs_id';

ShuttleRunsGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttleRunsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle run, in the form <job_id>:<run_number>',
	}),
};

module.exports = ShuttleRunsGetCommand;
