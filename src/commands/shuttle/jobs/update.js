'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { jobFlags, buildJobFields } = require('../../../modules/shuttle');

class ShuttleJobsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobsUpdateCommand);
		const requestBody = {};

		if (Object.hasOwn(flags, 'name')) {
			requestBody.name = flags.name;
		}
		buildJobFields(flags, requestBody);

		if (Object.keys(requestBody).length === 0) {
			this.error('Please provide at least one update flag.');
		}

		const job = await this.tsClient.shuttle.updateShuttleJobByIdV2026R0(
			args.id,
			requestBody
		);
		await this.output(job.rawData ?? job);
	}
}

ShuttleJobsUpdateCommand.description =
	'Update a Box Shuttle job. Only the passed fields are changed';
ShuttleJobsUpdateCommand.examples = [
	'box shuttle:jobs:update 6a3ba68e810d9156194530a1 --name "Finance migration v2"',
	'box shuttle:jobs:update 6a3ba68e810d9156194530a1 --tag finance --tag q3 --clear-max-file-versions --no-deletions-mirrored',
];
ShuttleJobsUpdateCommand._endpoint = 'put_shuttle_jobs_id';

ShuttleJobsUpdateCommand.flags = {
	...BoxCommand.flags,
	name: Flags.string({
		description: 'Human-readable name of the shuttle job',
	}),
	...jobFlags({ update: true }),
};

ShuttleJobsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job to update',
	}),
};

module.exports = ShuttleJobsUpdateCommand;
