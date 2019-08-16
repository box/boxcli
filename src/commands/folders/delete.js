'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FoldersDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersDeleteCommand);
		let options = {};

		if (flags.hasOwnProperty('recursive')) {
			options.recursive = flags.recursive;
		}

		if (flags.etag) {
			options.etag = flags.etag;
		}

		await this.client.folders.delete(args.id, options);

		if (flags.force) {
			try {
				await this.client.folders.deletePermanently(args.id);
			} catch (err) {
				// If the item can't be found in the trash, assume that it was already deleted or
				// that the enterprise didn't have trash enabled.  This should be regarded as a success case.
				if (err.statusCode !== 404) {
					throw err;
				}
			}
		}
		this.info(`Deleted folder ${args.id}${flags.force ? ' permanently' : ''}`);
	}
}

FoldersDeleteCommand.description = 'Delete a folder';
FoldersDeleteCommand.examples = [
	'box folders:delete 22222'
];
FoldersDeleteCommand._endpoint = 'delete_folders_id';

FoldersDeleteCommand.flags = {
	...BoxCommand.flags,
	etag: flags.string({ description: 'Only delete if etag value matches' }),
	recursive: flags.boolean({
		char: 'r',
		description: 'Delete the folder, even if it still has items in it',
	}),
	force: flags.boolean({
		char: 'f',
		description: 'Permanently delete the folder, bypassing the trash',
	})
};

FoldersDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to delete',
	}
];

module.exports = FoldersDeleteCommand;
