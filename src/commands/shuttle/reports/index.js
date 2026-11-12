'use strict';

const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleReportsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleReportsListCommand);
		const reports = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleReportsV2026R0(pageQueryParams),
			{ runId: flags['run-id'] }
		);
		await this.output(reports);
	}
}

ShuttleReportsListCommand.aliases = ['shuttle:reports:list'];
ShuttleReportsListCommand.description = `List shuttle reports ${SHUTTLE_PERMISSIONS}`;
ShuttleReportsListCommand.examples = [
	'box shuttle:reports --run-id 6a315c0754833bfc5df067bf:42',
];
ShuttleReportsListCommand._endpoint = 'get_shuttle_reports';

ShuttleReportsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'run-id': Flags.string({
		description: 'Shuttle run ID whose reports to list',
		required: true,
	}),
};

module.exports = ShuttleReportsListCommand;
