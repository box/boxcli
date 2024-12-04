'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class FoldersMoveCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersMoveCommand);
		let updates = {
			parent: {
				id: args.parentID,
			},
		};

		if (flags.etag) {
			updates.etag = flags.etag;
		}

		let movedFolder = await this.client.folders.update(args.id, updates);
		await this.output(movedFolder);
	}
}

FoldersMoveCommand.description = 'Move a folder to a different folder';
FoldersMoveCommand.examples = ['box folders:move 22222 44444'];
FoldersMoveCommand._endpoint = 'put_folders_id move';

FoldersMoveCommand.flags = {
	...BoxCommand.flags,
	etag: Flags.string({ description: 'Only move if etag value matches' }),
};

FoldersMoveCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of folder to copy',
	}),
	parentID: Args.string({
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of the new parent folder to move the folder into',
	})
};

module.exports = FoldersMoveCommand;
