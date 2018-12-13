'use strict';

const BoxCommand = require('../../box-command');

class TrashListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TrashListCommand);

		let trashedItems = await this.client.trash.get();
		await this.output(trashedItems);
	}
}

TrashListCommand.aliases = [ 'trash:list' ];

TrashListCommand.description = 'List all items in trash';

TrashListCommand.flags = {
	...BoxCommand.flags
};

module.exports = TrashListCommand;
