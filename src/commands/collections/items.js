'use strict';

const BoxCommand = require('../../box-command');

class CollectionsListItemsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollectionsListItemsCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let items = await this.client.collections.getItems(args.id, options);
		await this.output(items);
	}
}

CollectionsListItemsCommand.description = 'Get items in a collection';
CollectionsListItemsCommand.examples = [
	'box collections:items 12345'
];
CollectionsListItemsCommand._endpoint = 'get_collections_id_items';

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
