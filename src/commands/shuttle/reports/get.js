'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleReportsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleReportsGetCommand);
		const report = await this.tsClient.shuttle.getShuttleReportByIdV2026R0(
			args.id
		);
		await this.output(report.rawData ?? report);
	}
}

ShuttleReportsGetCommand.description =
	'Get a Box Shuttle report, including its generation status and, once status is complete, the generated Box file or folder in output. Keep polling while status is pending or processing; stop on complete, failed, canceled or any other value';
ShuttleReportsGetCommand.examples = [
	'box shuttle:reports:get 6a3ba8d14f2c91e8370b4d12',
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
