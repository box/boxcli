'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobsPrepareMigrationCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobsPrepareMigrationCommand);
		await this.tsClient.shuttle.createShuttleJobPrepareMigrationV2026R0(
			args.id
		);
		this.info(`Accepted prepare migration of shuttle job ${args.id}`);
	}
}

ShuttleJobsPrepareMigrationCommand.description =
	'Validate the account and path mappings of a Box Shuttle job before a transfer. Only relevant when account mapping is enabled. The API accepts the request and validates asynchronously; follow progress in mapping_state of shuttle:jobs:get';
ShuttleJobsPrepareMigrationCommand.examples = [
	'box shuttle:jobs:prepare-migration 6a3ba68e810d9156194530a1',
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
