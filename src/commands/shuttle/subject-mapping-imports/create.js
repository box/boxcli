'use strict';

const BoxCommand = require('../../../box-command');
const { mappingImportFlags } = require('../../../modules/shuttle');

class ShuttleSubjectMappingImportsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			ShuttleSubjectMappingImportsCreateCommand
		);
		await this.tsClient.shuttle.createShuttleSubjectMappingImportV2026R0({
			jobId: flags['job-id'],
			fileId: flags['file-id'],
		});
		this.info(
			`Accepted subject mapping import for shuttle job ${flags['job-id']}`
		);
	}
}

ShuttleSubjectMappingImportsCreateCommand.description =
	'Replace all subject (user and group) mappings of a Box Shuttle job with a mapping workbook already stored in Box. The job must have account mapping enabled and a finished source scan, otherwise the API answers 409. A file that is not a subject-mapping workbook, or exceeds 10 MiB or 50,000 mapping rows, is rejected with 400 and the job is unchanged. The import runs asynchronously: poll shuttle:jobs:get while mapping_state is importing_subjects. When any row is invalid the job ends with no subject mappings and mapping_state subjects_import_rejected; shuttle:mapping-errors lists the row problems with category subject_import. Only one import may run per job.\n\nWorkbook format: sheets Users and/or Groups (a sheet named Subjects is also accepted). Columns are "Source User <Key>", "Target User <Key>", "Skip" on Users, and "Source Group <Key>", "Target Group <Key>", "Skip" on Groups. <Key> is Email for users on most systems, ID for SharePoint 2007/2010/2013, Name for Windows (windows_union); Name for groups on most systems, Email for Google Drive admin groups. Source rows can be taken from shuttle:discovered-subjects';
ShuttleSubjectMappingImportsCreateCommand.examples = [
	'box shuttle:subject-mapping-imports:create --job-id 6a3ba68e810d9156194530a1 --file-id 12345',
];
ShuttleSubjectMappingImportsCreateCommand._endpoint =
	'post_shuttle_subject_mapping_imports';

ShuttleSubjectMappingImportsCreateCommand.flags = {
	...BoxCommand.flags,
	...mappingImportFlags('subject'),
};

module.exports = ShuttleSubjectMappingImportsCreateCommand;
