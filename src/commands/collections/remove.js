'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');
const chalk = require('chalk');

class CollectionsRemoveCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(CollectionsRemoveCommand);
		let item;

		if (args.itemType === 'file') {
			item = await this.client.files.removeFromCollection(args.itemID, args.collectionID);
		} else if (args.itemType === 'folder') {
			item = await this.client.folders.removeFromCollection(args.itemID, args.collectionID);
		}
		this.info(chalk`{green Removed ${args.itemType} "${item.name}" from collection ${args.collectionID}}`);
	}
}

CollectionsRemoveCommand.description = 'Remove an item from a collection';
CollectionsRemoveCommand.examples = ['box collections:remove file 11111 12345'];

CollectionsRemoveCommand.flags = {
	...BoxCommand.flags
};

CollectionsRemoveCommand.args = {
	itemType: Args.string({
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item',
		options: [
			'folder',
			'file'
		]
	}),
	itemID: Args.string({
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of item'
	}),
	collectionID: Args.string({
		name: 'collectionID',
		required: true,
		hidden: false,
		description: 'ID of collection'
	}),
};

module.exports = CollectionsRemoveCommand;
