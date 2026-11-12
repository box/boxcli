'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const { resolveBody, bodyFlags } = require('../../../modules/shuttle');

class ShuttleSubjectMappingImportsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			ShuttleSubjectMappingImportsCreateCommand
		);
		const requestBody = resolveBody(flags, () => {
			if (!flags['job-id'] || !flags['file-id']) {
				this.error(
					'--job-id and --file-id are required unless --body / --body-file is set.'
				);
			}
			return {
				jobId: flags['job-id'],
				fileId: flags['file-id'],
			};
		});

		await this.tsClient.shuttle.createShuttleSubjectMappingImportV2026R0(
			requestBody
		);
	}
}

ShuttleSubjectMappingImportsCreateCommand.description =
	'Import shuttle subject mappings from a Box spreadsheet file (async; empty response on accept)';
ShuttleSubjectMappingImportsCreateCommand.examples = [
	'box shuttle:subject-mapping-imports:create --job-id 6a315c0754833bfc5df067bf --file-id 12345678901',
];
ShuttleSubjectMappingImportsCreateCommand._endpoint =
	'post_shuttle_subject_mapping_imports';

ShuttleSubjectMappingImportsCreateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'job-id': Flags.string({
		description: 'Shuttle job ID (required unless --body / --body-file)',
	}),
	'file-id': Flags.string({
		description:
			'Box file ID of the mapping workbook (required unless --body / --body-file)',
	}),
};

module.exports = ShuttleSubjectMappingImportsCreateCommand;
