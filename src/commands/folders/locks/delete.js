'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class FoldersLocksDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(FoldersLocksDeleteCommand);

		await this.client.folders.deleteLock(args.id);
		this.info(`Delete folder lock with ID ${args.id}`);
	}
}

FoldersLocksDeleteCommand.description = 'Delete a lock on a folder';
FoldersLocksDeleteCommand.examples = ['box folders:locks:delete 22222'];
FoldersLocksDeleteCommand._endpoint = 'get_folder_locks_id';

FoldersLocksDeleteCommand.flags = {
	...BoxCommand.flags,
};

FoldersLocksDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder lock to delete',
	})
};

module.exports = FoldersLocksDeleteCommand;
