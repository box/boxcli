'use strict';

const BoxCommand = require('../../box-command');
const chalk = require('chalk');
const SharedLinksModule = require('../../modules/shared-links');

class SharedLinksDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SharedLinksDeleteCommand);

		let sharedLinksModule = new SharedLinksModule(this.client);
		let item = await sharedLinksModule.removeSharedLink(args);
		this.info(chalk`{green Removed shared link from ${args.itemType} "${item.name}"}`);
	}
}

SharedLinksDeleteCommand.description = 'Delete a shared link for a Box item';
SharedLinksDeleteCommand.examples = ['box shared-links:delete 22222 folder'];

SharedLinksDeleteCommand.flags = {
	...BoxCommand.flags
};

SharedLinksDeleteCommand.args = [
	{
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the Box item to remove the shared link from',
	},
	{
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item for shared link: either file or folder',
		options: [
			'file',
			'folder'
		],
	}
];

module.exports = SharedLinksDeleteCommand;
