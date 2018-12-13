'use strict';

const BoxCommand = require('../../../box-command');
const FilesDownloadCommand = require('../download');
const _ = require('lodash');

class FilesVersionsDownloadCommand extends BoxCommand {
	run() {
		const { args } = this.parse(FilesVersionsDownloadCommand);
		// Clone the args and replace the versionID arg with the --version flag
		let argv = this.argv.slice();
		argv.splice(argv.indexOf(args.fileVersionID), 1, `--version=${args.fileVersionID}`);
		return FilesDownloadCommand.run(argv);
	}
}

FilesVersionsDownloadCommand.description = 'Download a specific version of a file';

FilesVersionsDownloadCommand.flags = {
	..._.omit(FilesDownloadCommand.flags, 'version'),
};

FilesVersionsDownloadCommand.args = [
	{
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to download'
	},
	{
		name: 'fileVersionID',
		required: true,
		hidden: false,
		description: 'ID of file version to download'
	}
];

module.exports = FilesVersionsDownloadCommand;
