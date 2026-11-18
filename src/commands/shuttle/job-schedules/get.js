'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleJobSchedulesGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleJobSchedulesGetCommand);
		const schedule = await this.tsClient.shuttle.getShuttleJobScheduleByIdV2026R0(
			args.id
		);
		await this.output(schedule.rawData ?? schedule);
	}
}

ShuttleJobSchedulesGetCommand.description = `Get a shuttle job schedule by ID ${SHUTTLE_PERMISSIONS}`;
ShuttleJobSchedulesGetCommand.examples = [
	'box shuttle:job-schedules:get 6a315c0754833bfc5df067bf',
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
