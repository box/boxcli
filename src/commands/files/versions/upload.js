'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const fs = require('node:fs');
const {
	createReadStream,
	uploadNewFileVersion,
} = require('../../../modules/upload');

class FilesUploadVersionsCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(FilesUploadVersionsCommand);
		const { args } = await this.parse(FilesUploadVersionsCommand);
		const size = fs.statSync(args.path).size;
		const fileAttributes = {};
		const stream = createReadStream(args.path);

		if (flags['content-modified-at']) {
			fileAttributes.content_modified_at = flags['content-modified-at'];
		}
		// @TODO(2018-08-24): Consider adding --preserve-timestamps flag
		if (flags.name) {
			fileAttributes.name = flags.name;
		}

		const file = await uploadNewFileVersion(this.client, {
			fileID: args.fileID,
			stream,
			size,
			fileAttributes,
		});
		await this.output(file.entries[0]);
	}
}

FilesUploadVersionsCommand.description = 'Upload a new version of a file';
FilesUploadVersionsCommand.examples = [
	'box files:versions:upload 11111 /path/to/file.pdf',
];
FilesUploadVersionsCommand._endpoint = 'post_files_id_content';

FilesUploadVersionsCommand.flags = {
	...BoxCommand.flags,
	'content-modified-at': Flags.string({
		description:
			'The last modification date of the file version. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks',
	}),
	name: Flags.string({
		char: 'n',
		description: 'Provide different name for uploaded file',
	}),
};

FilesUploadVersionsCommand.args = {
	fileID: Args.string({
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to upload a new version of',
	}),
	path: Args.string({
		name: 'path',
		required: true,
		hidden: false,
		description: 'Local path to the file to upload',
	}),
};

module.exports = FilesUploadVersionsCommand;
