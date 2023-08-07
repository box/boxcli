'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../util');

class FoldersRenameCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersRenameCommand);
		let updates = {
			name: args.name,
		};

		if (flags.description) {
			updates.description = flags.description;
		}

		if (flags.etag) {
			updates.etag = flags.etag;
		}

		let renamedFolder = await this.client.folders.update(args.id, updates);
		await this.output(renamedFolder);
	}
}

FoldersRenameCommand.description = 'Rename a folder';
FoldersRenameCommand.examples = ['box folders:rename 22222 "New Folder Name"'];

FoldersRenameCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({ description: 'Change the folder description', parse: utils.unescapeSlashes }),
	etag: flags.string({ description: 'Only rename if etag value matches' })
};

FoldersRenameCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to rename',
	},
	{
		name: 'name',
		required: true,
		hidden: false,
		description: 'New name for the folder',
	}
];

module.exports = FoldersRenameCommand;
