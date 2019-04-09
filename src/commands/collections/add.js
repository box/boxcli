'use strict';

const BoxCommand = require('../../box-command');
const chalk = require('chalk');

class CollectionsAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollectionsAddCommand);
		let item;

		if (args.itemType === 'file') {
			item = await this.client.files.addToCollection(args.itemID, args.collectionID);
		} else if (args.itemType === 'folder') {
			item = await this.client.folders.addToCollection(args.itemID, args.collectionID);
		} else if (args.itemType === 'web_link') {
			item = await this.client.weblinks.addToCollection(args.itemID, args.collectionID);
		}

		this.info(chalk`{green Added ${args.itemType} "${item.name}" to collection ${args.collectionID}}`);
	}
}

CollectionsAddCommand.description = 'Add an item to a collection';

CollectionsAddCommand.flags = {
	...BoxCommand.flags
};

CollectionsAddCommand.args = [
	{
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item',
		options: [
			'folder',
			'file',
			'web_link'
		]
	},
	{
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the of item'
	},
	{
		name: 'collectionID',
		required: true,
		hidden: false,
		description: 'ID of collection'
	}
];

module.exports = CollectionsAddCommand;
