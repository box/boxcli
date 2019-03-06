'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs-extra');
const path = require('path');
const progress = require('cli-progress');
const BoxCLIError = require('../../cli-error');

const CHUNKED_UPLOAD_FILE_SIZE = 1024 * 1024 * 100; // 100 MiB

class FilesUploadCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesUploadCommand);
		let size = (await fs.stat(args.path)).size;
		let folderID = flags['parent-id'];
		let stream;
		try {
			stream = fs.createReadStream(args.path);
		} catch (ex) {
			throw new BoxCLIError(`Could not open file ${args.path}`, ex);
		}
		let fileAttributes = {};
		let name;

		if (flags.name) {
			name = flags.name;
		} else {
			name = path.basename(args.path);
		}
		if (flags['content-created-at']) {
			fileAttributes.content_created_at = this.getDateFromString(flags['content-created-at']);
		}
		if (flags['content-modified-at']) {
			fileAttributes.content_modified_at = this.getDateFromString(flags['content-modified-at']);
		}

		// @TODO(2018-08-24): Consider adding --preserve-timestamps flag

		let file;
		if (size < CHUNKED_UPLOAD_FILE_SIZE) {
			file = await this.client.files.uploadFile(folderID, name, stream, fileAttributes);
		} else {
			let progressBar = new progress.Bar({
				format: '[{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Speed: {speed} MB/s',
				stopOnComplete: true,
			});
			let uploader = await this.client.files.getChunkedUploader(folderID, size, name, stream, { fileAttributes });
			let bytesUploaded = 0;
			let startTime = Date.now();
			progressBar.start(size, 0, { speed: 'N/A' });
			uploader.on('chunkUploaded', chunk => {
				bytesUploaded += chunk.part.size;
				progressBar.update(bytesUploaded, {
					speed: Math.floor(bytesUploaded / (Date.now() - startTime) / 1000),
				});
			});
			file = await uploader.start();
		}

		await this.output(file.entries[0]);
	}
}

FilesUploadCommand.description = 'Upload a file';

FilesUploadCommand.flags = {
	...BoxCommand.flags,
	'parent-id': flags.string({
		char: 'p',
		description: 'ID of the parent folder to upload the file to; defaults to the root folder',
		default: '0'
	}),
	name: flags.string({
		char: 'n',
		description: 'Provide different name for uploaded file'
	}),
	'content-created-at': flags.string({ description: 'The creation date of the file content. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks' }),
	'content-modified-at': flags.string({ description: 'The modification date of the file content. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks' }),
	'id-only': flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
};

FilesUploadCommand.args = [
	{
		name: 'path',
		required: true,
		hidden: false,
		description: 'Path to the file to be uploaded',
	}
];

module.exports = FilesUploadCommand;
