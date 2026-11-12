'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleMappingErrorsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleMappingErrorsListCommand);
		const errors = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleMappingErrorsV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(errors);
	}
}

ShuttleMappingErrorsListCommand.aliases = ['shuttle:mapping-errors:list'];
ShuttleMappingErrorsListCommand.description = 'List shuttle mapping errors';
ShuttleMappingErrorsListCommand.examples = [
	'box shuttle:mapping-errors --job-id 6a315c0754833bfc5df067bf',
];
ShuttleMappingErrorsListCommand._endpoint = 'get_shuttle_mapping_errors';

ShuttleMappingErrorsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID whose mapping errors to list',
		required: true,
	}),
};

module.exports = ShuttleMappingErrorsListCommand;
