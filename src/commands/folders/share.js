'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const SharedLinksCreateCommand = require('../shared-links/create');
const SharedLinksModule = require('../../modules/shared-links');

class FoldersShareCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FoldersShareCommand);

		// Transform arguments for generic module
		args.itemType = 'folder';
		args.itemID = args.id;
		delete args.id;

		let sharedLinksModule = new SharedLinksModule(this.client);
		let updatedItem = await sharedLinksModule.createSharedLink(args, flags);
		await this.output(updatedItem.shared_link);
	}
}

FoldersShareCommand.aliases = [
	'folders:shared-links:create',
	'folders:shared-links:update'
];

FoldersShareCommand.description = 'Create a shared link for a folder';
FoldersShareCommand.examples = ['box folders:share 22222 --access company'];
FoldersShareCommand._endpoint = 'put_folders_id create_shared_link';

FoldersShareCommand.flags = {
	...SharedLinksCreateCommand.flags,
};

FoldersShareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to share',
	}
];

module.exports = FoldersShareCommand;
