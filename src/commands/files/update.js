'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FileUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FileUpdateCommand);
		let updates = {};

		if (flags.name) {
			updates.name = flags.name;
		}
		if (flags.hasOwnProperty('description')) {
			updates.description = flags.description;
		}
		if (flags.tags) {
			updates.tags = flags.tags.split(',');
		}

		if (flags.etag) {
			updates.etag = flags.etag;
		}

		let updatedFile = await this.client.files.update(args.id, updates);
		await this.output(updatedFile);
	}
}

FileUpdateCommand.description = 'Update a file record';
FileUpdateCommand.examples = ['box files:update 11111 --name "New File Name.pdf"'];
FileUpdateCommand._endpoint = 'put_files_id';

FileUpdateCommand.flags = {
	...BoxCommand.flags,
	name: flags.string({ description: 'New name for the file' }),
	description: flags.string({ description: 'New description for the file' }),
	tags: flags.string({ description: 'Set tags on the file, specified as comma-separated tags' }),
	etag: flags.string({ description: 'Only apply updates if the ETag value matches' }),
};

FileUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to update'
	}
];

module.exports = FileUpdateCommand;
