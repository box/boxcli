'use strict';

const BoxCommand = require('../../../box-command');

class FoldersLocksDeleteCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(FoldersLocksDeleteCommand);

		await this.client.folders.deleteLock(args.id);
        this.info(`Delete folder lock with ID ${args.id}`);
	}
}

FoldersLocksDeleteCommand.description = 'Delete a lock on a folder';
FoldersLocksDeleteCommand.examples = ['box folders:locks:delete 22222'];
FoldersLocksDeleteCommand._endpoint = 'get_folders_id_collaborations';

FoldersLocksDeleteCommand.flags = {
	...BoxCommand.flags,
};

FoldersLocksDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder lock to delete',
	}
];

module.exports = FoldersLocksDeleteCommand;
