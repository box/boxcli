'use strict';

const BoxCommand = require('../../../box-command');

class FoldersLocksListCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(FoldersLocksListCommand);

		let lock = await this.client.folders.lock(args.id);
		await this.output(lock);
	}
}

FoldersLocksListCommand.description = 'Create a lock on a folder';
FoldersLocksListCommand.examples = ['box folders:locks:create 22222'];

FoldersLocksListCommand.flags = {
	...BoxCommand.flags,
};

FoldersLocksListCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to create a lock on',
	}
];

module.exports = FoldersLocksListCommand;
