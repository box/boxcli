'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class FilesDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesDeleteCommand);

		let options = flags.etag ? { etag: flags.etag } : null;

		await this.client.files.delete(args.id, options);

		if (flags.force) {
			try {
				await this.client.files.deletePermanently(args.id);
			} catch (err) {
				// If the item can't be found in the trash, assume that it was already deleted or
				// that the enterprise didn't have trash enabled.  This should be regarded as a success case.
				if (err.statusCode !== 404) {
					throw err;
				}
			}
		}
		this.info(
			`Deleted file ${args.id}${flags.force ? ' permanently' : ''}`
		);
	}
}

FilesDeleteCommand.description = 'Delete a file';
FilesDeleteCommand.examples = ['box files:delete 11111'];
FilesDeleteCommand._endpoint = 'delete_files_id';

FilesDeleteCommand.flags = {
	...BoxCommand.flags,
	force: Flags.boolean({
		char: 'f',
		description: 'Permanently delete the item, bypassing the trash',
	}),
	etag: Flags.string({ description: 'Only delete if etag value matches' }),
};

FilesDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to delete',
	}),
};

module.exports = FilesDeleteCommand;
