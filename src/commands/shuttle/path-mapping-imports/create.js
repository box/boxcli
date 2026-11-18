'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const { resolveBody, bodyFlags, SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttlePathMappingImportsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			ShuttlePathMappingImportsCreateCommand
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

		await this.tsClient.shuttle.createShuttlePathMappingImportV2026R0(
			requestBody
		);
	}
}

ShuttlePathMappingImportsCreateCommand.description =
	`Import shuttle path mappings from a Box spreadsheet file (async; empty response on accept) ${SHUTTLE_PERMISSIONS}`;
ShuttlePathMappingImportsCreateCommand.examples = [
	'box shuttle:path-mapping-imports:create --job-id 6a315c0754833bfc5df067bf --file-id 12345678901',
];
ShuttlePathMappingImportsCreateCommand._endpoint =
	'post_shuttle_path_mapping_imports';

ShuttlePathMappingImportsCreateCommand.flags = {
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

module.exports = ShuttlePathMappingImportsCreateCommand;
