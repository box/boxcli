'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class FilesMoveCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesMoveCommand);
		let updates = {
			parent: {
				id: args.parentID
			}
		};

		if (flags.etag) {
			updates.etag = flags.etag;
		}

		let movedFile = await this.client.files.update(args.id, updates);
		await this.output(movedFile);
	}
}

FilesMoveCommand.description = 'Move a file to a different folder';
FilesMoveCommand.examples = ['box files:move 11111 22222'];
FilesMoveCommand._endpoint = 'put_files_id move';

FilesMoveCommand.flags = {
	...BoxCommand.flags,
	etag: Flags.string({ description: 'Only move if etag value matches' })
};

FilesMoveCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to move',
	}),
	parentID: Args.string({
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of the new parent folder to move the file into',
	}),
};

module.exports = FilesMoveCommand;
