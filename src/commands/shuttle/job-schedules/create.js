'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	scheduleTriggerFlags,
	buildScheduleTrigger,
} = require('../../../modules/shuttle');

class ShuttleJobSchedulesCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleJobSchedulesCreateCommand);
		const requestBody = resolveBody(flags, () => {
			if (!flags['job-id'] || !flags['run-mode']) {
				this.error(
					'--job-id and --run-mode are required unless --body / --body-file is set.'
				);
			}
			const body = {
				jobId: flags['job-id'],
				runMode: flags['run-mode'],
				trigger: buildScheduleTrigger(flags, {
					required: true,
					command: this,
				}),
			};
			if (flags.state !== undefined) {
				body.state = flags.state;
			}
			if (flags.description !== undefined) {
				body.description = flags.description;
			}
			return body;
		});

		const schedule =
			await this.tsClient.shuttle.createShuttleJobScheduleV2026R0(requestBody);
		await this.output(schedule.rawData ?? schedule);
	}
}

ShuttleJobSchedulesCreateCommand.description = 'Create a shuttle job schedule';
ShuttleJobSchedulesCreateCommand.examples = [
	'box shuttle:job-schedules:create --job-id 6a315c0754833bfc5df067bf --run-mode transfer --trigger-type by_time --start-at 2026-03-16T09:00:00 --time-zone America/Los_Angeles --repeat daily',
	'box shuttle:job-schedules:create --job-id 6a315c0754833bfc5df067bf --run-mode simulation --trigger-type by_job --triggered-by-job-id 8d2ca68e810d9156194530c3 --last-run-condition on_success',
];
ShuttleJobSchedulesCreateCommand._endpoint = 'post_shuttle_job_schedules';

ShuttleJobSchedulesCreateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'job-id': Flags.string({
		description: 'Shuttle job ID (required unless --body / --body-file)',
	}),
	'run-mode': Flags.string({
		description: 'Schedule run mode (required unless --body / --body-file)',
		options: ['transfer', 'simulation', 'analysis'],
	}),
	state: Flags.string({
		description: 'Schedule state',
		options: ['enabled', 'paused'],
	}),
	description: Flags.string({
		description: 'Optional schedule description',
	}),
	...scheduleTriggerFlags,
};

module.exports = ShuttleJobSchedulesCreateCommand;
