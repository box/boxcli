'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('node:fs');
const path = require('node:path');
const BoxCLIError = require('../../cli-error');
const { createReadStream, uploadFile, uploadNewFileVersion } = require('../../modules/upload');
const DEBUG = require('../../debug');

class FilesUploadCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesUploadCommand);
		let size = fs.statSync(args.path).size;
		let folderID = flags['parent-id'];
		let stream = createReadStream(args.path);
		let fileAttributes = {};
		let name;

		name = flags.name || path.basename(args.path);
		if (flags['content-created-at']) {
			fileAttributes.content_created_at = flags['content-created-at'];
		}
		if (flags['content-modified-at']) {
			fileAttributes.content_modified_at = flags['content-modified-at'];
		}

		let file;
		try {
			file = await uploadFile(this.client, {
				folderID,
				name,
				stream,
				size,
				fileAttributes,
			});
		} catch (error) {
			const { statusCode, response } = error;
			const body = response?.body;

			if (!flags.overwrite || statusCode !== 409 || body?.code !== 'item_name_in_use') {
				throw error;
			}

			const conflicts = body.context_info?.conflicts;
			const existingFileID = Array.isArray(conflicts)
				? conflicts?.[0]?.id
				: conflicts?.id;

			if (!existingFileID) {
				throw new BoxCLIError(
					'File already exists but could not determine the existing file ID from the conflict response. Try uploading a new version manually with files:versions:upload.'
				);
			}

			DEBUG.output(`File already exists in folder; uploading as new version of file ${existingFileID}`);

			// Re-create the stream since the first attempt consumed it
			const versionStream = createReadStream(args.path);

			file = await uploadNewFileVersion(this.client, {
				fileID: existingFileID,
				stream: versionStream,
				size,
				fileAttributes,
			});
		}

		await this.output(file.entries[0]);
	}
}

FilesUploadCommand.description = 'Upload a file to a folder. Use --overwrite to automatically replace an existing file with the same name by uploading a new version';
FilesUploadCommand.examples = [
	'box files:upload /path/to/file.pdf --parent-id 22222',
	'box files:upload /path/to/file.pdf --parent-id 22222 --overwrite',
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
			'The creation date of the file content. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. Not supported with --overwrite',
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
	overwrite: Flags.boolean({
		description:
			'Overwrite the file if it already exists in the destination folder, by uploading a new file version',
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
