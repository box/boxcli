'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');
const chalk = require('chalk');

class CollectionsAddCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(CollectionsAddCommand);
		let item;

		switch (args.itemType) {
			case 'file': {
				item = await this.client.files.addToCollection(
					args.itemID,
					args.collectionID
				);

				break;
			}
			case 'folder': {
				item = await this.client.folders.addToCollection(
					args.itemID,
					args.collectionID
				);

				break;
			}
			case 'web_link': {
				item = await this.client.weblinks.addToCollection(
					args.itemID,
					args.collectionID
				);

				break;
			}
			// No default
		}

		this.info(
			chalk`{green Added ${args.itemType} "${item.name}" to collection ${args.collectionID}}`
		);
	}
}

CollectionsAddCommand.description = 'Add an item to a collection';
CollectionsAddCommand.examples = ['box collections:add file 11111 12345'];

CollectionsAddCommand.flags = {
	...BoxCommand.flags,
};

CollectionsAddCommand.args = {
	itemType: Args.string({
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item',
		options: ['folder', 'file', 'web_link'],
	}),
	itemID: Args.string({
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the of item',
	}),
	collectionID: Args.string({
		name: 'collectionID',
		required: true,
		hidden: false,
		description: 'ID of collection',
	}),
};

module.exports = CollectionsAddCommand;
