'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { jobScheduleFlags, buildTrigger } = require('../../../modules/shuttle');

class ShuttleJobSchedulesUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			ShuttleJobSchedulesUpdateCommand
		);
		const requestBody = {};

		if (Object.hasOwn(flags, 'state')) {
			requestBody.state = flags.state;
		}
		if (Object.hasOwn(flags, 'run-mode')) {
			requestBody.runMode = flags['run-mode'];
		}
		if (Object.hasOwn(flags, 'description')) {
			requestBody.description = flags.description;
		}
		if (flags['clear-description']) {
			requestBody.description = null;
		}
		const trigger = buildTrigger(flags);
		if (trigger) {
			requestBody.trigger = trigger;
		}

		if (Object.keys(requestBody).length === 0) {
			this.error('Please provide at least one update flag.');
		}

		const schedule =
			await this.tsClient.shuttle.updateShuttleJobScheduleByIdV2026R0(
				args.id,
				requestBody
			);
		await this.output(schedule.rawData ?? schedule);
	}
}

ShuttleJobSchedulesUpdateCommand.description =
	'Update a Box Shuttle job schedule. Only the passed fields are changed; the job of the schedule cannot be changed';
ShuttleJobSchedulesUpdateCommand.examples = [
	'box shuttle:job-schedules:update 7c1ba68e810d9156194530b2 --run-mode simulation',
	'box shuttle:job-schedules:update 7c1ba68e810d9156194530b2 --state paused --trigger-type by_time --start-at 2030-01-01T09:00:00 --time-zone Europe/Warsaw --repeat weekdays',
];
ShuttleJobSchedulesUpdateCommand._endpoint = 'put_shuttle_job_schedules_id';

ShuttleJobSchedulesUpdateCommand.flags = {
	...BoxCommand.flags,
	...jobScheduleFlags({ update: true }),
};

ShuttleJobSchedulesUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle job schedule to update',
	}),
};

module.exports = ShuttleJobSchedulesUpdateCommand;
