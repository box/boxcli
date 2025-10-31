'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class TrashRestoreCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TrashRestoreCommand);
		let options = {};

		if (flags.name) {
			options.name = flags.name;
		}
		if (flags['parent-id']) {
			options.parent = {
				id: flags['parent-id'],
			};
		}
		let item;
		switch (args.type) {
			case 'file': {
				item = await this.client.files.restoreFromTrash(
					args.id,
					options
				);

				break;
			}
			case 'folder': {
				item = await this.client.folders.restoreFromTrash(
					args.id,
					options
				);

				break;
			}
			case 'web_link': {
				item = await this.client.wrapWithDefaultHandler(
					this.client.post
				)(`/web_links/${args.id}`, { body: options });

				break;
			}
			// No default
		}
		await this.output(item);
	}
}

TrashRestoreCommand.description = 'Restore an item from trash';
TrashRestoreCommand.examples = ['box trash:restore folder 22222'];

TrashRestoreCommand.flags = {
	...BoxCommand.flags,
	name: Flags.string({
		description: 'The new name for the item',
	}),
	'parent-id': Flags.string({
		description:
			'ID of a folder to restore the item to only when the original folder no longer exists',
	}),
};

TrashRestoreCommand.args = {
	type: Args.string({
		name: 'type',
		required: true,
		hidden: false,
		description: 'Type of the item to restore',
		options: ['file', 'folder', 'web_link'],
	}),
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the item to restore',
	}),
};

module.exports = TrashRestoreCommand;
