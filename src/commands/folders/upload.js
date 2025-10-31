'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('node:fs');
const path = require('node:path');
const BoxCLIError = require('../../cli-error');
const utilities = require('../../util');

const CHUNKED_UPLOAD_FILE_SIZE = 1024 * 1024 * 100; // 100 MiB

class FoldersUploadCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersUploadCommand);

		let folderId = await this.uploadFolder(
			args.path,
			flags['parent-folder'],
			flags['folder-name']
		);
		let folder = await this.client.folders.get(folderId);
		await this.output(folder);
	}

	async uploadFolder(folderPath, parentFolderId, folderName) {
		folderName = folderName || path.basename(folderPath);

		let folderItems;
		try {
			folderItems = await utilities.readdirAsync(folderPath);
		} catch (error) {
			throw new BoxCLIError(
				`Could not read directory ${folderPath}`,
				error
			);
		}
		// Filters out files or folders that have a "." as the first character in their name. These won't be uploaded.
		folderItems = folderItems.filter((item) => item[0] !== '.');

		let folder = await this.client.folders.create(
			parentFolderId,
			folderName
		);
		let folderId = folder.id;

		// @TODO(2018-09-14): Add --preserve-timestamps flag

		for (let item of folderItems) {
			// @TODO(2018-08-15): Improve performance by queueing async work and performing it in parallel

			let itemPath = path.join(folderPath, item);
			let itemStat = fs.statSync(itemPath);
			if (itemStat.isDirectory()) {
				await this.uploadFolder(itemPath, folderId);
			} else {
				let size = itemStat.size;

				try {
					let fileStream = fs.createReadStream(itemPath);
					if (size < CHUNKED_UPLOAD_FILE_SIZE) {
						await this.client.files.uploadFile(
							folderId,
							item,
							fileStream
						);
					} else {
						let uploader =
							await this.client.files.getChunkedUploader(
								folderId,
								size,
								item,
								fileStream
							);
						await uploader.start();
					}
				} catch (error) {
					throw new BoxCLIError(
						`Could not upload file ${itemPath}`,
						error
					);
				}
			}
		}
		return folderId;
	}
}

FoldersUploadCommand.description = 'Upload a folder';
FoldersUploadCommand.examples = ['box folders:upload /path/to/folder'];

FoldersUploadCommand.flags = {
	...BoxCommand.flags,
	'folder-name': Flags.string({
		description: 'Name to use for folder if not using local folder name',
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
	'parent-folder': Flags.string({
		char: 'p',
		description:
			'Folder to upload this folder into; defaults to the root folder',
		default: '0',
	}),
};

FoldersUploadCommand.args = {
	path: Args.string({
		name: 'path',
		required: true,
		hidden: false,
		description: 'Local path to the folder to upload',
	}),
};

module.exports = FoldersUploadCommand;
