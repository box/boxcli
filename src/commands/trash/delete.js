'use strict';

const BoxCommand = require('../../box-command');

class TrashDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TrashDeleteCommand);

		if (args.type === 'file') {
			await this.client.files.deletePermanently(args.id);
		} else if (args.type === 'folder') {
			await this.client.folders.deletePermanently(args.id);
		} else if (args.type === 'web_link') {
			await this.client.wrapWithDefaultHandler(this.client.del)(`/web_links/${args.id}/trash`);
		}
		this.info(`Deleted item ${args.id}`);
	}
}

TrashDeleteCommand.description = 'Permanently delete an item';

TrashDeleteCommand.flags = {
	...BoxCommand.flags
};

TrashDeleteCommand.args = [
	{
		name: 'type',
		required: true,
		hidden: false,
		description: 'Type of the item to permanently delete',
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
		description: 'ID of the item to permanently delete',
	}
];

module.exports = TrashDeleteCommand;
