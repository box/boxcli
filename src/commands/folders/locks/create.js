'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class FoldersLocksCreateCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(FoldersLocksCreateCommand);

		let lock = await this.client.folders.lock(args.id);
		await this.output(lock);
	}
}

FoldersLocksCreateCommand.description = 'Create a lock on a folder';
FoldersLocksCreateCommand.examples = ['box folders:locks:create 22222'];
FoldersLocksCreateCommand._endpoint = 'post_folder_locks';

FoldersLocksCreateCommand.flags = {
	...BoxCommand.flags,
};

FoldersLocksCreateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to create a lock on',
	})
};

module.exports = FoldersLocksCreateCommand;
