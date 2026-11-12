'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsPrepareMigrationCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsPrepareMigrationCommand);
		await this.tsClient.shuttle.createShuttleJobPrepareMigrationV2026R0(
			args.id
		);
	}
}

ShuttleJobsPrepareMigrationCommand.description =
	'Prepare a shuttle job for migration';
ShuttleJobsPrepareMigrationCommand.examples = [
	'box shuttle:jobs:prepare-migration 6a315c0754833bfc5df067bf',
];
ShuttleJobsPrepareMigrationCommand._endpoint =
	'post_shuttle_jobs_id_prepare_migration';

ShuttleJobsPrepareMigrationCommand.flags = {
	...BoxCommand.flags,
};

ShuttleJobsPrepareMigrationCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job',
	}),
};

module.exports = ShuttleJobsPrepareMigrationCommand;
