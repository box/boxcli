'use strict';

const BoxCommand = require('../../box-command');

class TrashGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TrashGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}
		let item;
		if (args.type === 'file') {
			item = await this.client.files.getTrashedFile(args.id, options);
		} else if (args.type === 'folder') {
			item = await this.client.folders.getTrashedFolder(args.id, options);
		} else if (args.type === 'web_link') {
			item = await this.client.wrapWithDefaultHandler(this.client.get)(`/web_links/${args.id}/trash`, {qs: options});
		}
		await this.output(item);
	}
}

TrashGetCommand.description = 'Get information about an item in trash';
TrashGetCommand.examples = ['box trash:get folder 22222'];

TrashGetCommand.flags = {
	...BoxCommand.flags
};

TrashGetCommand.args = [
	{
		name: 'type',
		required: true,
		hidden: false,
		description: 'Type of the item to get',
		options: [
			'file',
			'folder',
			'web_link'
		],
	},
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the item to get',
	}
];

module.exports = TrashGetCommand;
