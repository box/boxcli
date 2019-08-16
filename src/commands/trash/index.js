'use strict';

const BoxCommand = require('../../box-command');

class TrashListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TrashListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let trashedItems = await this.client.trash.get(options);
		await this.output(trashedItems);
	}
}

TrashListCommand.aliases = [ 'trash:list' ];

TrashListCommand.description = 'List all items in trash';
TrashListCommand.examples = ['box trash'];
TrashListCommand._endpoint = 'get_folders_trash_items';

TrashListCommand.flags = {
	...BoxCommand.flags
};

module.exports = TrashListCommand;
