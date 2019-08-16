'use strict';

const BoxCommand = require('../../../box-command');
const FilesDownloadCommand = require('../download');
const BoxCLIError = require('../../../cli-error');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

class FilesVersionsDownloadCommand extends BoxCommand {
	async run() {

		const { flags, args } = this.parse(FilesVersionsDownloadCommand);

		let file = await this.client.files.get(args.fileID);
		let fileName = file.name;

		let filePath = path.join(flags.destination || this.settings.boxDownloadsFolderPath, fileName);

		/* eslint-disable no-sync */
		if (fs.existsSync(filePath)) {
		/* eslint-enable no-sync */

			let shouldOverwrite = await this.confirm(`File ${filePath} already exists — overwrite?`);

			if (!shouldOverwrite) {
				return;
			}
		}

		let options = {};
		options.version = args.fileVersionID;

		let stream = await this.client.files.getReadStream(args.fileID, options);
		try {
			let output = fs.createWriteStream(filePath);
			stream.pipe(output);
		} catch (ex) {
			throw new BoxCLIError(`Could not download to destination file ${filePath}`, ex);
		}

		// @TODO(2018-09-18): Add progress bar for large downloads

		/* eslint-disable promise/avoid-new */
		// We need to await the end of the stream to avoid a race condition here
		await new Promise((resolve, reject) => {
			stream.on('end', resolve);
			stream.on('error', reject);
		});
		this.info(`Downloaded file ${fileName}`);
	}
}

FilesVersionsDownloadCommand.description = 'Download a specific version of a file';
FilesVersionsDownloadCommand.examples = ['box files:versions:download 11111 55555'];

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
