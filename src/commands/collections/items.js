'use strict';

const BoxCommand = require('../../box-command');

class CollectionsListItemsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollectionsListItemsCommand);

		let items = await this.client.collections.getItems(args.id);
		await this.output(items);
	}
}

CollectionsListItemsCommand.description = 'Get items in a collection';

CollectionsListItemsCommand.flags = {
	...BoxCommand.flags
};

CollectionsListItemsCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collection to retrieve the items of'
	}
];

module.exports = CollectionsListItemsCommand;
