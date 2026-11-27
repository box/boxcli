'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsDeleteCommand);
		await this.tsClient.shuttle.deleteShuttleJobByIdV2026R0(args.id);
		this.info(`Deleted shuttle job ${args.id}`);
	}
}

ShuttleJobsDeleteCommand.description =
	'Permanently delete a Box Shuttle job. Content that has already been migrated is not affected';
ShuttleJobsDeleteCommand.examples = [
	'box shuttle:jobs:delete 6a3ba68e810d9156194530a1',
];
ShuttleJobsDeleteCommand._endpoint = 'delete_shuttle_jobs_id';

ShuttleJobsDeleteCommand.flags = {
	...BoxCommand.flags,
};

ShuttleJobsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job to delete',
	}),
};

module.exports = ShuttleJobsDeleteCommand;
