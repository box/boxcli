'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class FilesDeleteVersionsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesDeleteVersionsCommand);

		let options = flags.etag ? { etag: flags.etag } : null;

		await this.client.files.deleteVersion(args.fileID, args.fileVersionID, options);
		this.info(`Deleted file version ${args.fileVersionID} from file ${args.fileID}`);
	}
}

FilesDeleteVersionsCommand.description = 'Delete a file version';
FilesDeleteVersionsCommand.examples = ['box files:versions:delete 11111 55555'];
FilesDeleteVersionsCommand._endpoint = 'delete_files_id_versions_id';

FilesDeleteVersionsCommand.flags = {
	...BoxCommand.flags,
	etag: Flags.string({ description: 'Only delete if etag value matches' })
};

FilesDeleteVersionsCommand.args = {
	fileID: Args.string({
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to get versions for'
	}),
	fileVersionID: Args.string({
		name: 'fileVersionID',
		required: true,
		hidden: false,
		description: 'ID of the file version to delete'
	}),
};

module.exports = FilesDeleteVersionsCommand;
