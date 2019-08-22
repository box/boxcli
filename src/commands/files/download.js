'use strict';

const { flags } = require('@oclif/command');
const BoxCommand = require('../../box-command');
const fs = require('fs');
const path = require('path');
const BoxCLIError = require('../../cli-error');
const utils = require('../../util');

class FilesDownloadCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesDownloadCommand);

		let file = await this.client.files.get(args.id);
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

		if (flags.version) {
			options.version = flags.version;
		}

		let stream = await this.client.files.getReadStream(args.id, options);
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

FilesDownloadCommand.description = 'Download a file';
FilesDownloadCommand.examples = ['box files:download 11111 --destination /path/to/destinationFolder'];
FilesDownloadCommand._endpoint = 'get_files_id_content';

FilesDownloadCommand.flags = {
	...BoxCommand.flags,
	version: flags.string({
		description: 'File version ID of the specific file version to download',
	}),
	destination: flags.string({
		description: 'The destination folder to write the file to',
		parse: utils.parsePath,
	}),
};

FilesDownloadCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to download'
	}
];

module.exports = FilesDownloadCommand;
