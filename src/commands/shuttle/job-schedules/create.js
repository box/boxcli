'use strict';

const BoxCommand = require('../../../box-command');
const {
	jobIdFlag,
	jobScheduleFlags,
	buildTrigger,
} = require('../../../modules/shuttle');

class ShuttleJobSchedulesCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleJobSchedulesCreateCommand);
		const requestBody = {
			jobId: flags['job-id'],
			runMode: flags['run-mode'],
			trigger: buildTrigger(flags),
		};

		if (Object.hasOwn(flags, 'state')) {
			requestBody.state = flags.state;
		}
		if (Object.hasOwn(flags, 'description')) {
			requestBody.description = flags.description;
		}

		const schedule =
			await this.tsClient.shuttle.createShuttleJobScheduleV2026R0(
				requestBody
			);
		await this.output(schedule.rawData ?? schedule);
	}
}

ShuttleJobSchedulesCreateCommand.description =
	"Create a schedule that starts runs of a Box Shuttle job, either at a wall-clock time (--trigger-type=by_time) or after another job's run meets a condition (--trigger-type=by_job). Schedules cannot start a run in scan mode";
ShuttleJobSchedulesCreateCommand.examples = [
	'box shuttle:job-schedules:create --job-id 6a3ba68e810d9156194530a1 --run-mode transfer --trigger-type by_time --start-at 2030-01-01T09:00:00 --time-zone America/Los_Angeles --repeat daily',
	'box shuttle:job-schedules:create --job-id 6a3ba68e810d9156194530a1 --run-mode simulation --state paused --trigger-type by_job --triggered-by-job-id 6a3ba68e810d9156194530a2 --last-run-condition on_success',
];
ShuttleJobSchedulesCreateCommand._endpoint = 'post_shuttle_job_schedules';

ShuttleJobSchedulesCreateCommand.flags = {
	...BoxCommand.flags,
	'job-id': jobIdFlag('ID of the shuttle job this schedule belongs to'),
	...jobScheduleFlags(),
};

module.exports = ShuttleJobSchedulesCreateCommand;
