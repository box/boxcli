'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	scheduleTriggerFlags,
	buildScheduleTrigger,
} = require('../../../modules/shuttle');

class ShuttleJobSchedulesUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttleJobSchedulesUpdateCommand);
		const requestBody = resolveBody(flags, () => {
			const body = {};
			if (flags.state !== undefined) {
				body.state = flags.state;
			}
			if (flags['run-mode'] !== undefined) {
				body.runMode = flags['run-mode'];
			}
			if (flags.description !== undefined) {
				body.description = flags.description;
			}
			const trigger = buildScheduleTrigger(flags, { command: this });
			if (trigger !== undefined) {
				body.trigger = trigger;
			}
			if (Object.keys(body).length === 0) {
				this.error(
					'Provide at least one update flag, or use --body / --body-file.'
				);
			}
			return body;
		});

		const schedule = await this.tsClient.shuttle.updateShuttleJobScheduleByIdV2026R0(
			args.id,
			requestBody
		);
		await this.output(schedule.rawData ?? schedule);
	}
}

ShuttleJobSchedulesUpdateCommand.description = 'Update a shuttle job schedule';
ShuttleJobSchedulesUpdateCommand.examples = [
	'box shuttle:job-schedules:update 6a315c0754833bfc5df067bf --state paused',
	'box shuttle:job-schedules:update 6a315c0754833bfc5df067bf --trigger-type by_time --start-at 2026-03-16T09:00:00 --time-zone America/Los_Angeles --repeat weekdays',
];
ShuttleJobSchedulesUpdateCommand._endpoint = 'put_shuttle_job_schedules_id';

ShuttleJobSchedulesUpdateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	state: Flags.string({
		description: 'Schedule state',
		options: ['enabled', 'paused'],
	}),
	'run-mode': Flags.string({
		description: 'Schedule run mode',
		options: ['transfer', 'simulation', 'analysis'],
	}),
	description: Flags.string({
		description: 'Updated description',
	}),
	...scheduleTriggerFlags,
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
