'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobSchedulesDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobSchedulesDeleteCommand);
		await this.tsClient.shuttle.deleteShuttleJobScheduleByIdV2026R0(
			args.id
		);
		this.info(`Deleted shuttle job schedule ${args.id}`);
	}
}

ShuttleJobSchedulesDeleteCommand.description =
	'Permanently delete a Box Shuttle job schedule. Runs that have already started are not affected';
ShuttleJobSchedulesDeleteCommand.examples = [
	'box shuttle:job-schedules:delete 7c1ba68e810d9156194530b2',
];
ShuttleJobSchedulesDeleteCommand._endpoint = 'delete_shuttle_job_schedules_id';

ShuttleJobSchedulesDeleteCommand.flags = {
	...BoxCommand.flags,
};

ShuttleJobSchedulesDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job schedule to delete',
	}),
};

module.exports = ShuttleJobSchedulesDeleteCommand;
