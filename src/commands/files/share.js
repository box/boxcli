'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const { sharedLinkFlags, sharedLinkFileFlags } = require('../shared-links/create');
const SharedLinksModule = require('../../modules/shared-links');

class FilesShareCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FilesShareCommand);

		// Transform arguments for generic module
		args.itemType = 'file';
		args.itemID = args.id;
		delete args.id;

		let sharedLinksModule = new SharedLinksModule(this.client);
		let updatedItem = await sharedLinksModule.createSharedLink(args, flags);
		await this.output(updatedItem.shared_link);
	}
}

FilesShareCommand.aliases = [
	'files:shared-links:create',
	'files:shared-links:update',
];

FilesShareCommand.description = 'Create a shared link for a file';
FilesShareCommand.examples = ['box files:share 11111 --access company'];
FilesShareCommand._endpoint = 'put_files_id create_shared_link';

FilesShareCommand.flags = {
	...sharedLinkFlags,
	...sharedLinkFileFlags
};

FilesShareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to share',
	},
];

module.exports = FilesShareCommand;
