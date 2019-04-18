'use strict';

const BoxCommand = require('../../box-command');
const SharedLinksDeleteCommand = require('../shared-links/delete');
const SharedLinksModule = require('../../modules/shared-links');
const chalk = require('chalk');

class FoldersUnshareCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(FoldersUnshareCommand);

		// Clone the args and insert the "folder" type at the correct position for the generic command
		// let argv = this.argv.slice();
		// argv.splice(argv.indexOf(args.id) + 1, 0, 'folder');
		// return SharedLinksDeleteCommand.run(argv);

		args.itemType = 'folder';
		args.itemID = args.id;
		delete args.id;

		let sharedLinksModule = new SharedLinksModule(this.client);
		let item = await sharedLinksModule.removeSharedLink(args);
		this.info(chalk`{green Removed shared link from ${args.itemType} "${item.name}"}`);
	}
}

FoldersUnshareCommand.aliases = [ 'folders:shared-links:delete' ];

FoldersUnshareCommand.description = 'Delete a shared link for a folder';

FoldersUnshareCommand.flags = {
	...SharedLinksDeleteCommand.flags,
};

FoldersUnshareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to unshare',
	}
];

module.exports = FoldersUnshareCommand;
