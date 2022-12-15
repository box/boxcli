/* eslint-disable no-sync  */
'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs');
const progress = require('cli-progress');
const BoxCLIError = require('../../../cli-error');

const CHUNKED_UPLOAD_FILE_SIZE = 1024 * 1024 * 100; // 100 MiB

class FilesUploadVersionsCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(FilesUploadVersionsCommand);
		const { args } = this.parse(FilesUploadVersionsCommand);
		let size = fs.statSync(args.path).size;
		let fileAttributes = {};
		let stream;
		try {
			stream = fs.createReadStream(args.path);
		} catch (ex) {
			throw new BoxCLIError(`Could not open file ${args.path}`, ex);
		}

		if (flags['content-modified-at']) {
			fileAttributes.content_modified_at = flags['content-modified-at'];
		}
		// @TODO(2018-08-24): Consider adding --preserve-timestamps flag
		if (flags.name) {
			fileAttributes.name = flags.name;
		}

		let file;
		if (size < CHUNKED_UPLOAD_FILE_SIZE) {
			file = await this.client.files.uploadNewFileVersion(args.fileID, stream, fileAttributes);
		} else {
			let progressBar = new progress.Bar({
				format: '[{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Speed: {speed} MB/s',
				stopOnComplete: true,
			});
			let uploader = await this.client.files.getNewVersionChunkedUploader(args.fileID, size, stream, { fileAttributes });
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

FilesUploadVersionsCommand.description = 'Upload a new version of a file';
FilesUploadVersionsCommand.examples = ['box files:versions:upload 11111 /path/to/file.pdf'];
FilesUploadVersionsCommand._endpoint = 'post_files_id_content';

FilesUploadVersionsCommand.flags = {
	...BoxCommand.flags,
	'content-modified-at': flags.string({ description: 'The last modification date of the file version. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks' }),
	name: flags.string({
		char: 'n',
		description: 'Provide different name for uploaded file'
	})
};

FilesUploadVersionsCommand.args = [
	{
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to upload a new version of'
	},
	{
		name: 'path',
		required: true,
		hidden: false,
		description: 'Local path to the file to upload'
	}
];

module.exports = FilesUploadVersionsCommand;
