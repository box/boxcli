'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../util');

class FilesRenameCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesRenameCommand);
		let options = {
			name: args.name,
		};

		if (flags.hasOwnProperty('description')) {
			options.description = flags.description;
		}

		if (flags.etag) {
			options.etag = flags.etag;
		}

		let file = await this.client.files.update(args.id, options);
		await this.output(file);
	}
}

FilesRenameCommand.description = 'Rename a file';
FilesRenameCommand.examples = ['box files:rename 11111 "New File Name.pdf"'];

FilesRenameCommand.flags = {
	...BoxCommand.flags,
	description: Flags.string({ description: 'Change the file description', parse: utils.unescapeSlashes }),
	etag: Flags.string({ description: 'Only rename if etag value matches' })
};

FilesRenameCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of file to rename'
	}),
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'New name of file'
	}),
};

module.exports = FilesRenameCommand;
