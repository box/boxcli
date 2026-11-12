'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleRunsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleRunsGetCommand);
		const run = await this.tsClient.shuttle.getShuttleRunByIdV2026R0(args.id);
		await this.output(run.rawData ?? run);
	}
}

ShuttleRunsGetCommand.description = 'Get a shuttle run by ID';
ShuttleRunsGetCommand.examples = [
	'box shuttle:runs:get 6a315c0754833bfc5df067bf:42',
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
		description: 'ID of the shuttle run',
	}),
};

module.exports = ShuttleRunsGetCommand;
