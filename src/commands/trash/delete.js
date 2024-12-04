'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class TrashDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TrashDeleteCommand);

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
TrashDeleteCommand.examples = ['box trash:delete folder 22222'];

TrashDeleteCommand.flags = {
	...BoxCommand.flags
};

TrashDeleteCommand.args = {
	type: Args.string({
		name: 'type',
		required: true,
		hidden: false,
		description: 'Type of the item to permanently delete',
		options: [
			'file',
			'folder',
			'web_link'
		],
	}),
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the item to permanently delete',
	}),
};

module.exports = TrashDeleteCommand;
