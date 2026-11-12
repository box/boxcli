'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const { resolveBody, bodyFlags, SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleReportsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleReportsCreateCommand);
		const requestBody = resolveBody(flags, () => {
			if (!flags['run-id'] || !flags.format || !flags.section) {
				this.error(
					'--run-id, --format, and at least one --section are required unless --body / --body-file is set.'
				);
			}
			const body = {
				runId: flags['run-id'],
				format: flags.format,
				sections: flags.section,
			};
			if (flags['users-scope'] !== undefined) {
				body.usersScope = flags['users-scope'];
			}
			return body;
		});

		const report = await this.tsClient.shuttle.createShuttleReportV2026R0(requestBody);
		await this.output(report.rawData ?? report);
	}
}

ShuttleReportsCreateCommand.description =
	`Create (generate) a shuttle report for a run ${SHUTTLE_PERMISSIONS}`;
ShuttleReportsCreateCommand.examples = [
	'box shuttle:reports:create --run-id 6a315c0754833bfc5df067bf:42 --format xlsx --section event_log --section transfer_overview',
];
ShuttleReportsCreateCommand._endpoint = 'post_shuttle_reports';

ShuttleReportsCreateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'run-id': Flags.string({
		description: 'Shuttle run ID (required unless --body / --body-file)',
	}),
	format: Flags.string({
		description:
			'Report format (required unless --body / --body-file). Accepted values: xlsx, csv',
		options: ['xlsx', 'csv'],
	}),
	section: Flags.string({
		description:
			'Report section to include (repeatable; required unless --body / --body-file)',
		multiple: true,
	}),
	'users-scope': Flags.string({
		description:
			'Users scope for user-related sections. Accepted values: migrated, all',
		options: ['migrated', 'all'],
	}),
};

module.exports = ShuttleReportsCreateCommand;
