'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class CollectionsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(CollectionsGetCommand);
		const collection = await this.tsClient.collections.getCollectionById(
			args.id
		);
		await this.output(collection.rawData ?? collection);
	}
}

CollectionsGetCommand.description =
	'Get a collection by its ID. Returns the collection type (always "collection"), ID, name (such as "Favorites") and collection_type (such as "favorites"). Run "box collections" to list the IDs of your collections.';
CollectionsGetCommand.examples = ['box collections:get 926489'];
CollectionsGetCommand._endpoint = 'get_collections_id';

CollectionsGetCommand.flags = {
	...BoxCommand.flags,
};

CollectionsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collection',
	}),
};

module.exports = CollectionsGetCommand;
