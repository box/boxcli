'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const { resolveBody, bodyFlags, SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleJobsStartCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobsStartCommand);
		const requestBody = resolveBody(flags, () => {
			const body = {};
			if (flags.mode !== undefined) {
				body.mode = flags.mode;
			}
			return body;
		});

		const optionals =
			Object.keys(requestBody).length > 0
				? { requestBody }
				: {};
		await this.tsClient.shuttle.createShuttleJobStartV2026R0(
			args.id,
			optionals
		);
	}
}

ShuttleJobsStartCommand.description = `Start a shuttle job run ${SHUTTLE_PERMISSIONS}`;
ShuttleJobsStartCommand.examples = [
	'box shuttle:jobs:start 6a315c0754833bfc5df067bf',
	'box shuttle:jobs:start 6a315c0754833bfc5df067bf --mode transfer',
];
ShuttleJobsStartCommand._endpoint = 'post_shuttle_jobs_id_start';

ShuttleJobsStartCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	mode: Flags.string({
		description:
			'Run mode (defaults to simulation when omitted). Accepted values: transfer, simulation, scan, analysis',
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
