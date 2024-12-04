'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const FilesDownloadCommand = require('../download');
const BoxCLIError = require('../../../cli-error');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const utils = require('../../../util');

class FilesVersionsDownloadCommand extends BoxCommand {
	async run() {

		const { flags, args } = await this.parse(FilesVersionsDownloadCommand);

		let file = await this.client.files.get(args.fileID);
		let fileName = flags['save-as'] ? flags['save-as'] : file.name;

		let filePath;

		if (flags.destination) {
			await utils.checkDir(flags.destination, flags['create-path']);
			filePath = path.join(flags.destination, fileName);
		} else {
			filePath = path.join(this.settings.boxDownloadsFolderPath, fileName);
		}

		/* eslint-disable no-sync */
		if (!flags.overwrite && fs.existsSync(filePath)) {
		/* eslint-enable no-sync */

			if (flags.overwrite === false) {
				this.info(`Downloading the file will not occur because the file ${filePath} already exists, and the --no-overwrite flag is set.`);
				return;
			}

			let shouldOverwrite = await this.confirm(`File ${filePath} already exists — overwrite?`);

			if (!shouldOverwrite) {
				return;
			}
		}

		let options = {};
		options.version = args.fileVersionID;

		let stream = await this.client.files.getReadStream(args.fileID, options);
		let output;
		try {
			output = fs.createWriteStream(filePath);
			stream.pipe(output);
		} catch (ex) {
			throw new BoxCLIError(`Could not download to destination file ${filePath}`, ex);
		}

		// @TODO(2018-09-18): Add progress bar for large downloads

		/* eslint-disable promise/avoid-new */
		// We need to await the end of the stream to avoid a race condition here
		await new Promise((resolve, reject) => {
			output.on('close', resolve);
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

FilesVersionsDownloadCommand.args = {
	fileID: Args.string({
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to download'
	}),
	fileVersionID: Args.string({
		name: 'fileVersionID',
		required: true,
		hidden: false,
		description: 'ID of file version to download'
	}),
};

module.exports = FilesVersionsDownloadCommand;
