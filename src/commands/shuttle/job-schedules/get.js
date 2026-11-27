'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleJobSchedulesGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobSchedulesGetCommand);
		const schedule =
			await this.tsClient.shuttle.getShuttleJobScheduleByIdV2026R0(
				args.id
			);
		await this.output(schedule.rawData ?? schedule);
	}
}

ShuttleJobSchedulesGetCommand.description = 'Get a Box Shuttle job schedule';
ShuttleJobSchedulesGetCommand.examples = [
	'box shuttle:job-schedules:get 7c1ba68e810d9156194530b2',
];
ShuttleJobSchedulesGetCommand._endpoint = 'get_shuttle_job_schedules_id';

ShuttleJobSchedulesGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttleJobSchedulesGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job schedule',
	}),
};

module.exports = ShuttleJobSchedulesGetCommand;
