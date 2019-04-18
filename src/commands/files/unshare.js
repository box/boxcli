'use strict';

const BoxCommand = require('../../box-command');
const SharedLinksDeleteCommand = require('../shared-links/delete');
const SharedLinksModule = require('../../modules/shared-links');
const chalk = require('chalk');

class FilesUnshareCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(FilesUnshareCommand);

		// Clone the args and insert the "file" type at the correct position for the generic command
		// let argv = this.argv.slice();
		// argv.splice(argv.indexOf(args.id) + 1, 0, 'file');
		// return SharedLinksDeleteCommand.run(argv);

		args.itemType = 'file';
		args.itemID = args.id;
		delete args.id;

		let sharedLinksModule = new SharedLinksModule(this.client);
		let item = await sharedLinksModule.removeSharedLink(args);
		this.info(chalk`{green Removed shared link from ${args.itemType} "${item.name}"}`);
	}
}

FilesUnshareCommand.aliases = ['files:shared-links:delete'];

FilesUnshareCommand.description = 'Delete a shared link for a file';

FilesUnshareCommand.flags = {
	...SharedLinksDeleteCommand.flags,
};

FilesUnshareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to unshare'
	}
];

module.exports = FilesUnshareCommand;
