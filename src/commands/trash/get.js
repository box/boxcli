'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class TrashGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TrashGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}
		let item;
		switch (args.type) {
			case 'file': {
				item = await this.client.files.getTrashedFile(args.id, options);

				break;
			}
			case 'folder': {
				item = await this.client.folders.getTrashedFolder(
					args.id,
					options
				);

				break;
			}
			case 'web_link': {
				item = await this.client.wrapWithDefaultHandler(
					this.client.get
				)(`/web_links/${args.id}/trash`, { qs: options });

				break;
			}
			// No default
		}
		await this.output(item);
	}
}

TrashGetCommand.description = 'Get information about an item in trash';
TrashGetCommand.examples = ['box trash:get folder 22222'];

TrashGetCommand.flags = {
	...BoxCommand.flags,
};

TrashGetCommand.args = {
	type: Args.string({
		name: 'type',
		required: true,
		hidden: false,
		description: 'Type of the item to get',
		options: ['file', 'folder', 'web_link'],
	}),
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the item to get',
	}),
};

module.exports = TrashGetCommand;
