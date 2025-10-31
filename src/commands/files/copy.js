'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class FilesCopyCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesCopyCommand);
		let options = {};

		if (flags.name) {
			options.name = flags.name;
		}
		if (flags.version) {
			options.version = flags.version;
		}

		let fileCopy = await this.client.files.copy(
			args.id,
			args.parentID,
			options
		);
		await this.output(fileCopy);
	}
}

FilesCopyCommand.description = 'Copy a file to a different folder';
FilesCopyCommand.examples = ['box files:copy 11111 22222'];
FilesCopyCommand._endpoint = 'post_files_id_copy';

FilesCopyCommand.flags = {
	...BoxCommand.flags,
	name: Flags.string({ description: 'New name for the file' }),
	version: Flags.string({
		description:
			'File version ID if you want to copy a specific file version',
	}),
	'id-only': Flags.boolean({
		description: 'Output only the ID of the file copy ',
	}),
};

FilesCopyCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to copy',
	}),
	parentID: Args.string({
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of the new parent folder to copy the file into',
	}),
};

module.exports = FilesCopyCommand;
