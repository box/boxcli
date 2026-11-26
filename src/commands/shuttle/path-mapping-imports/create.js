'use strict';

const BoxCommand = require('../../../box-command');
const { mappingImportFlags } = require('../../../modules/shuttle');

class ShuttlePathMappingImportsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			ShuttlePathMappingImportsCreateCommand
		);
		await this.tsClient.shuttle.createShuttlePathMappingImportV2026R0({
			jobId: flags['job-id'],
			fileId: flags['file-id'],
		});
		this.info(
			`Accepted path mapping import for shuttle job ${flags['job-id']}`
		);
	}
}

ShuttlePathMappingImportsCreateCommand.description =
	'Replace all path mappings of a Box Shuttle job with a mapping workbook already stored in Box. A file that is not a mapping workbook, or exceeds 10 MiB or 100,000 mapping rows, is rejected with 400 and the job is unchanged. The import runs asynchronously: poll shuttle:jobs:get while mapping_state is importing_paths. When any row is invalid the job ends with no path mappings and mapping_state paths_import_rejected; shuttle:mapping-errors lists the row problems with category path_import. Only one import may run per job';
ShuttlePathMappingImportsCreateCommand.examples = [
	'box shuttle:path-mapping-imports:create --job-id 6a3ba68e810d9156194530a1 --file-id 12345',
];
ShuttlePathMappingImportsCreateCommand._endpoint =
	'post_shuttle_path_mapping_imports';

ShuttlePathMappingImportsCreateCommand.flags = {
	...BoxCommand.flags,
	...mappingImportFlags('path'),
};

module.exports = ShuttlePathMappingImportsCreateCommand;
