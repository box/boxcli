'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class FilesDeleteVersionsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesDeleteVersionsCommand);

		let options = flags.etag ? { etag: flags.etag } : null;

		await this.client.files.deleteVersion(args.fileID, args.fileVersionID, options);
		this.info(`Deleted file version ${args.fileVersionID} from file ${args.fileID}`);
	}
}

FilesDeleteVersionsCommand.description = 'Delete a file version';

FilesDeleteVersionsCommand.flags = {
	...BoxCommand.flags,
	etag: flags.string({ description: 'Only delete if etag value matches' })
};

FilesDeleteVersionsCommand.args = [
	{
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to get versions for'
	},
	{
		name: 'fileVersionID',
		required: true,
		hidden: false,
		description: 'ID of the file version to delete'
	}
];

module.exports = FilesDeleteVersionsCommand;
