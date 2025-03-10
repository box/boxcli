'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('fs');
const path = require('path');
const utils = require('../../util');

class FilesZipCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesZipCommand);

		let fileName = args.name;
		if (!fileName.includes('.zip')) {
			fileName += '.zip';
		}

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

		let output = fs.createWriteStream(filePath);

		let downloadStatus;
		let outputFinished = false;
		/* eslint-disable promise/avoid-new */
		await new Promise((resolve, reject) => {
			/* eslint-disable promise/always-return */
			this.client.files.downloadZip(fileName, flags.item, output).then((status) => {
				downloadStatus = status;
				if (outputFinished) {
					resolve();
				}
			})
			.catch(reject);
			output.on('close', () => {
				output.close();
				outputFinished = true;
				if (downloadStatus) {
					resolve();
				}
			});
			output.on('error', reject);
		});
		await this.output(downloadStatus);
	}
}

FilesZipCommand.description = 'Create a zip of multiple files and folders and download it';
FilesZipCommand.examples = ['box files:zip sample_file.zip --item=file:12421 --item=folder:48291'];
FilesZipCommand._endpoint = 'zip_downloads';

FilesZipCommand.flags = {
	...BoxCommand.flags,
	destination: Flags.string({
		description: 'The destination folder to write the zip file to',
		parse: utils.parsePath,
	}),
	item: Flags.string({
		description:
			'Files or folders to be part of zip in the form type:ID (i.e. file:1374652)',
		multiple: true,
		required: true,
		parse(val) {
			let splitVal = val.split(':');
			return { type: splitVal[0], id: splitVal[1] };
		},
	}),
	'create-path': Flags.boolean({
		description: 'Recursively creates a path to a directory if it does not exist',
		allowNo: true,
		default: true,
	}),
	overwrite: Flags.boolean({
		description: 'Overwrite a zip file if it already exists',
		allowNo: true
	}),
};

FilesZipCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Name of the zip to be created and downloaded',
	}),
};

module.exports = FilesZipCommand;
