'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { jobFlags, buildJobFields } = require('../../../modules/shuttle');

class ShuttleJobsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobsCreateCommand);
		const requestBody = buildJobFields(flags, {
			name: args.name,
			jobType: flags['job-type'],
			sourceSystemId: flags['source-system-id'],
		});

		const job =
			await this.tsClient.shuttle.createShuttleJobV2026R0(requestBody);
		await this.output(job.rawData ?? job);
	}
}

ShuttleJobsCreateCommand.description =
	'Create a Box Shuttle job that migrates content from a source system into Box';
ShuttleJobsCreateCommand.examples = [
	'box shuttle:jobs:create "Finance migration" --job-type transfer --source-system-id 6a315c0754833bfc5df067bf',
	'box shuttle:jobs:create "Finance migration" --job-type transfer --source-system-id 6a315c0754833bfc5df067bf --tag finance --account-mapping-enabled --permission-conflict-strategy warn_permissions_conflicts --max-file-versions 10 --no-overwrite-enabled',
];
ShuttleJobsCreateCommand._endpoint = 'post_shuttle_jobs';

ShuttleJobsCreateCommand.flags = {
	...BoxCommand.flags,
	'job-type': Flags.string({
		description:
			'Type of work the shuttle job performs. One of: transfer, analysis',
		options: ['transfer', 'analysis'],
		required: true,
	}),
	'source-system-id': Flags.string({
		description:
			'ID of the shuttle system to migrate from, as listed by shuttle:systems',
		required: true,
	}),
	...jobFlags(),
};

ShuttleJobsCreateCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Human-readable name of the shuttle job',
	}),
};

module.exports = ShuttleJobsCreateCommand;
