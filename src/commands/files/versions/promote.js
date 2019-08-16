'use strict';

const BoxCommand = require('../../../box-command');

class FilesPromoteVersionsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesPromoteVersionsCommand);

		let version = await this.client.files.promoteVersion(args.fileID, args.fileVersionID);
		await this.output(version);
	}
}

FilesPromoteVersionsCommand.description = 'Promote a file version';
FilesPromoteVersionsCommand.examples = ['box files:versions:promote 11111 55555'];
FilesPromoteVersionsCommand._endpoint = 'post_files_id_versions_current';

FilesPromoteVersionsCommand.flags = {
	...BoxCommand.flags
};

FilesPromoteVersionsCommand.args = [
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

module.exports = FilesPromoteVersionsCommand;
