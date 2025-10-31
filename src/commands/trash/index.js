'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtilities = require('../../pagination-utils');

class TrashListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(TrashListCommand);
		let options = PaginationUtilities.forceMarkerPagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let trashedItems = await this.client.trash.get(options);
		await this.output(trashedItems);
	}
}

TrashListCommand.aliases = ['trash:list'];

TrashListCommand.description = 'List all items in trash';
TrashListCommand.examples = ['box trash'];
TrashListCommand._endpoint = 'get_folders_trash_items';

TrashListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

module.exports = TrashListCommand;
