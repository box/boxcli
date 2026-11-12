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
	SHUTTLE_PERMISSIONS,
} = require('../../../modules/shuttle');

class ShuttleJobsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobsUpdateCommand);
		const requestBody = resolveBody(flags, () => {
			const body = {};
			if (Object.hasOwn(flags, 'name')) {
				body.name = flags.name;
			}
			if (Object.hasOwn(flags, 'comment')) {
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
			if (Object.keys(body).length === 0) {
				this.error(
					'Provide at least one update flag, or use --body / --body-file.'
				);
			}
			return body;
		});

		const job = await this.tsClient.shuttle.updateShuttleJobByIdV2026R0(
			args.id,
			requestBody
		);
		await this.output(job.rawData ?? job);
	}
}

ShuttleJobsUpdateCommand.description = `Update a shuttle job ${SHUTTLE_PERMISSIONS}`;
ShuttleJobsUpdateCommand.examples = [
	'box shuttle:jobs:update 6a315c0754833bfc5df067bf --name "Q4 Migration (revised)"',
	'box shuttle:jobs:update 6a315c0754833bfc5df067bf --account-mapping-enabled --no-are-permissions-mapped',
];
ShuttleJobsUpdateCommand._endpoint = 'put_shuttle_jobs_id';

ShuttleJobsUpdateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	name: Flags.string({
		char: 'n',
		description: 'Updated display name',
	}),
	comment: Flags.string({
		description: 'Updated comment',
	}),
	tag: Flags.string({
		description: 'Replacement tags (repeatable)',
		multiple: true,
	}),
	...jobAccountMappingFlags,
	...jobSettingsFlags,
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
