'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleSubjectMappingsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleSubjectMappingsListCommand);
		const mappings = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttleSubjectMappingsV2026R0(pageQueryParams),
			{ jobId: flags['job-id'] }
		);
		await this.output(mappings);
	}
}

ShuttleSubjectMappingsListCommand.aliases = ['shuttle:subject-mappings:list'];
ShuttleSubjectMappingsListCommand.description = 'List shuttle subject mappings';
ShuttleSubjectMappingsListCommand.examples = [
	'box shuttle:subject-mappings --job-id 6a315c0754833bfc5df067bf',
];
ShuttleSubjectMappingsListCommand._endpoint = 'get_shuttle_subject_mappings';

ShuttleSubjectMappingsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID whose subject mappings to list',
		required: true,
	}),
};

module.exports = ShuttleSubjectMappingsListCommand;
