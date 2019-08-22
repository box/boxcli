'use strict';

const BoxCommand = require('../../box-command');

class CollectionsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollectionsListCommand);

		let collections = await this.client.collections.getAll();
		await this.output(collections);
	}
}

CollectionsListCommand.aliases = [ 'collections:list' ];

CollectionsListCommand.description = 'List your collections';
CollectionsListCommand.examples = ['box collections'];
CollectionsListCommand._endpoint = 'get_collections';

CollectionsListCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollectionsListCommand;
