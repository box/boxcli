'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const PaginationUtils = require('../../pagination-utils');

class FoldersListItemsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersListItemsCommand);
		let options = PaginationUtils.forceMarkerPagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		if (flags.direction) {
			options.direction = flags.direction;
		}
		if (flags.sort) {
			options.sort = flags.sort;
		}

		let items = await this.client.folders.getItems(args.id, options);
		await this.output(items);
	}
}

FoldersListItemsCommand.aliases = [ 'folders:list-items' ];

FoldersListItemsCommand.description = 'List items in a folder';
FoldersListItemsCommand.examples = ['box folders:items 22222'];
FoldersListItemsCommand._endpoint = 'get_folders_id_items';

FoldersListItemsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	direction: Flags.string({
		description: 'The direction to order returned items',
		options: [
			'ASC',
			'DESC'
		]
	}),
	sort: Flags.string({
		description: 'The parameter to sort returned items',
		options: [
			'id',
			'name',
			'date'
		]
	}),
};

FoldersListItemsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to get the items in, use 0 for the root folder',
	})
};

module.exports = FoldersListItemsCommand;
