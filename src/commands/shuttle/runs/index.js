'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleRunsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleRunsListCommand);
		const runs = await this.markerPagination(
			(pageQueryParams) => this.tsClient.shuttle.getShuttleRunsV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(runs);
	}
}

ShuttleRunsListCommand.aliases = ['shuttle:runs:list'];
ShuttleRunsListCommand.description = 'List shuttle runs';
ShuttleRunsListCommand.examples = [
	'box shuttle:runs --job-id 6a315c0754833bfc5df067bf',
];
ShuttleRunsListCommand._endpoint = 'get_shuttle_runs';

ShuttleRunsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID whose runs to list',
		required: true,
	}),
};

module.exports = ShuttleRunsListCommand;
