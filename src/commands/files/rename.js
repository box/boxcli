'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FilesRenameCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesRenameCommand);
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

FilesRenameCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({ description: 'Change the file description' }),
	etag: flags.string({ description: 'Only rename if etag value matches' })
};

FilesRenameCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of file to rename'
	},
	{
		name: 'name',
		required: true,
		hidden: false,
		description: 'New name of file'
	}
];

module.exports = FilesRenameCommand;
