'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class FoldersLocksListCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(FoldersLocksListCommand);

		let locks = await this.client.folders.getLocks(args.id);
		await this.output(locks);
	}
}

FoldersLocksListCommand.aliases = ['folders:locks:list'];

FoldersLocksListCommand.description = 'List all locks on a folder';
FoldersLocksListCommand.examples = ['box folders:locks 22222'];
FoldersLocksListCommand._endpoint = 'get_folder_locks';

FoldersLocksListCommand.flags = {
	...BoxCommand.flags,
};

FoldersLocksListCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to get the locks on',
	}),
};

module.exports = FoldersLocksListCommand;
