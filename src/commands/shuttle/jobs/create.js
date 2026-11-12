'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	jobAccountMappingFlags,
	buildAccountMapping,
	jobSettingsFlags,
	buildSettings,
} = require('../../../modules/shuttle');

class ShuttleJobsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobsCreateCommand);
		const requestBody = resolveBody(flags, () => {
			if (!args.name || !flags['job-type'] || !flags['source-system-id']) {
				this.error(
					'name, --job-type, and --source-system-id are required unless --body / --body-file is set.'
				);
			}
			const body = {
				name: args.name,
				jobType: flags['job-type'],
				sourceSystemId: flags['source-system-id'],
			};
			if (flags.comment !== undefined) {
				body.comment = flags.comment;
			}
			if (flags.tag) {
				body.tags = flags.tag;
			}
			const accountMapping = buildAccountMapping(flags);
			if (accountMapping) {
				body.accountMapping = accountMapping;
			}
			const settings = buildSettings(flags);
			if (settings) {
				body.settings = settings;
			}
			return body;
		});

		const job = await this.tsClient.shuttle.createShuttleJobV2026R0(requestBody);
		await this.output(job.rawData ?? job);
	}
}

ShuttleJobsCreateCommand.description = 'Create a shuttle job';
ShuttleJobsCreateCommand.examples = [
	'box shuttle:jobs:create "Q4 Migration" --job-type transfer --source-system-id 6a3ba68e810d9156194530a1',
	'box shuttle:jobs:create "Q4 Migration" --job-type transfer --source-system-id 6a3ba68e810d9156194530a1 --account-mapping-enabled --are-permissions-mapped --is-overwrite-enabled',
];
ShuttleJobsCreateCommand._endpoint = 'post_shuttle_jobs';

ShuttleJobsCreateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'job-type': Flags.string({
		description: 'Job type (required unless --body / --body-file)',
		options: ['transfer', 'analysis'],
	}),
	'source-system-id': Flags.string({
		description:
			'Source shuttle system ID (required unless --body / --body-file)',
	}),
	comment: Flags.string({
		description: 'Optional comment for the job',
	}),
	tag: Flags.string({
		description: 'Tag to attach (repeatable)',
		multiple: true,
	}),
	...jobAccountMappingFlags,
	...jobSettingsFlags,
};

ShuttleJobsCreateCommand.args = {
	name: Args.string({
		name: 'name',
		required: false,
		hidden: false,
		description:
			'Display name for the new shuttle job (required unless --body / --body-file)',
	}),
};

module.exports = ShuttleJobsCreateCommand;
