'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleReportsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleReportsGetCommand);
		const report = await this.tsClient.shuttle.getShuttleReportByIdV2026R0(args.id);
		await this.output(report.rawData ?? report);
	}
}

ShuttleReportsGetCommand.description = `Get a shuttle report by ID ${SHUTTLE_PERMISSIONS}`;
ShuttleReportsGetCommand.examples = [
	'box shuttle:reports:get 6a315c0754833bfc5df067bf',
];
ShuttleReportsGetCommand._endpoint = 'get_shuttle_reports_id';

ShuttleReportsGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttleReportsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle report',
	}),
};

module.exports = ShuttleReportsGetCommand;
