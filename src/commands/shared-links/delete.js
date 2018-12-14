'use strict';

const BoxCommand = require('../../box-command');
const chalk = require('chalk');

class SharedLinksDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SharedLinksDeleteCommand);
		let updates = { shared_link: null };
		let item;

		if (args.itemType === 'file') {
			item = await this.client.files.update(args.itemID, updates);
		} else if (args.itemType === 'folder') {
			item = await this.client.folders.update(args.itemID, updates);
		}
		this.info(chalk`{green Removed shared link from ${args.itemType} "${item.name}"}`);
	}
}

SharedLinksDeleteCommand.hidden = true;

SharedLinksDeleteCommand.description = 'Delete a shared link for a Box item';

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
