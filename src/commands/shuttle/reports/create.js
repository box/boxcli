'use strict';

const { Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { runIdFlag } = require('../../../modules/shuttle');

class ShuttleReportsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleReportsCreateCommand);
		const requestBody = {
			runId: flags['run-id'],
			format: flags.format,
			sections: flags.section,
		};

		if (Object.hasOwn(flags, 'users-scope')) {
			requestBody.usersScope = flags['users-scope'];
		}

		const report =
			await this.tsClient.shuttle.createShuttleReportV2026R0(requestBody);
		await this.output(report.rawData ?? report);
	}
}

ShuttleReportsCreateCommand.description =
	'Request generation of a report for a Box Shuttle run. The report is returned at once with status pending or processing; poll shuttle:reports:get until status is complete, failed, canceled or unknown. Repeating the request with the same values returns the existing report instead of a duplicate';
ShuttleReportsCreateCommand.examples = [
	'box shuttle:reports:create --run-id 6a3ba68e810d9156194530a1:42 --format xlsx --section transfer_overview --section files_and_folders',
	'box shuttle:reports:create --run-id 6a3ba68e810d9156194530a1:42 --format csv --section source_users --users-scope all',
];
ShuttleReportsCreateCommand._endpoint = 'post_shuttle_reports';

ShuttleReportsCreateCommand.flags = {
	...BoxCommand.flags,
	'run-id': runIdFlag(
		'ID of the shuttle run to generate a report for, in the form <job_id>:<run_number>'
	),
	format: Flags.string({
		description: 'Output file format of the report. One of: xlsx, csv',
		options: ['xlsx', 'csv'],
		required: true,
	}),
	section: Flags.string({
		description:
			'Section to include in the report. Repeat the flag for several sections. Must be one of available_report_sections of the run (shuttle:runs:get). The list is open; documented values include files_and_folders, event_log, transfer_overview, source_users, target_users, source_collaborators, target_collaborators, source_collaborations, target_collaborations',
		multiple: true,
		required: true,
	}),
	'users-scope': Flags.string({
		description:
			'Which users to include in user-related sections. One of: migrated, all. The API uses migrated when omitted',
		options: ['migrated', 'all'],
	}),
};

module.exports = ShuttleReportsCreateCommand;
