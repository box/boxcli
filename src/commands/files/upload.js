'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('node:fs');
const path = require('node:path');
const progress = require('cli-progress');
const BoxCLIError = require('../../cli-error');

const CHUNKED_UPLOAD_FILE_SIZE = 1024 * 1024 * 100; // 100 MiB

class FilesUploadCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesUploadCommand);
		let size = fs.statSync(args.path).size;
		let folderID = flags['parent-id'];
		let stream;
		try {
			stream = fs.createReadStream(args.path);
		} catch (error) {
			throw new BoxCLIError(`Could not open file ${args.path}`, error);
		}
		let fileAttributes = {};
		let name;

		name = flags.name || path.basename(args.path);
		if (flags['content-created-at']) {
			fileAttributes.content_created_at = flags['content-created-at'];
		}
		if (flags['content-modified-at']) {
			fileAttributes.content_modified_at = flags['content-modified-at'];
		}

		// @TODO(2018-08-24): Consider adding --preserve-timestamps flag

		let file;
		if (size < CHUNKED_UPLOAD_FILE_SIZE) {
			file = await this.client.files.uploadFile(
				folderID,
				name,
				stream,
				fileAttributes
			);
		} else {
			let progressBar = new progress.Bar({
				format: '[{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Speed: {speed} MB/s',
				stopOnComplete: true,
			});
			let uploader = await this.client.files.getChunkedUploader(
				folderID,
				size,
				name,
				stream,
				{ fileAttributes }
			);
			let bytesUploaded = 0;
			let startTime = Date.now();
			progressBar.start(size, 0, { speed: 'N/A' });
			uploader.on('chunkUploaded', (chunk) => {
				bytesUploaded += chunk.part.size;
				progressBar.update(bytesUploaded, {
					speed: Math.floor(
						bytesUploaded / (Date.now() - startTime) / 1000
					),
				});
			});
			file = await uploader.start();
		}

		await this.output(file.entries[0]);
	}
}

FilesUploadCommand.description = 'Upload a file';
FilesUploadCommand.examples = [
	'box files:upload /path/to/file.pdf --parent-id 22222',
];
FilesUploadCommand._endpoint = 'post_files_content';

FilesUploadCommand.flags = {
	...BoxCommand.flags,
	'parent-id': Flags.string({
		char: 'p',
		description:
			'ID of the parent folder to upload the file to; defaults to the root folder',
		default: '0',
	}),
	name: Flags.string({
		char: 'n',
		description: 'Provide different name for uploaded file',
	}),
	'content-created-at': Flags.string({
		description:
			'The creation date of the file content. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'content-modified-at': Flags.string({
		description:
			'The modification date of the file content. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
};

FilesUploadCommand.args = {
	path: Args.string({
		name: 'path',
		required: true,
		hidden: false,
		description: 'Path to the file to be uploaded',
	}),
};

module.exports = FilesUploadCommand;
