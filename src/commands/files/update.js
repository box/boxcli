'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../util');

class FileUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FileUpdateCommand);
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

		if (flags['disposition-at']) {
			updates.disposition_at = flags['disposition-at'];
		}

		let updatedFile = await this.client.files.update(args.id, updates);
		await this.output(updatedFile);
	}
}

FileUpdateCommand.description = 'Update a file record';
FileUpdateCommand.examples = [
	'box files:update 11111 --name "New File Name.pdf"',
];
FileUpdateCommand._endpoint = 'put_files_id';

FileUpdateCommand.flags = {
	...BoxCommand.flags,
	name: Flags.string({ description: 'New name for the file' }),
	description: Flags.string({
		description: 'New description for the file',
		parse: utils.unescapeSlashes,
	}),
	tags: Flags.string({
		description: 'Set tags on the file, specified as comma-separated tags',
	}),
	etag: Flags.string({
		description: 'Only apply updates if the ETag value matches',
	}),
	'disposition-at': Flags.string({
		description:
			'The retention expiration timestamp for the given file. This date cannot be shortened once set on a file',
	}),
};

FileUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to update',
	}),
};

module.exports = FileUpdateCommand;
