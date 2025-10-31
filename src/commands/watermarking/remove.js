'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class WatermarkingRemoveCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(WatermarkingRemoveCommand);

		if (args.itemType === 'file') {
			await this.client.files.removeWatermark(args.itemID);
		} else if (args.itemType === 'folder') {
			await this.client.folders.removeWatermark(args.itemID);
		}
		this.info(`Removed watermark for ${args.itemType} ${args.itemID}`);
	}
}

WatermarkingRemoveCommand.description = 'Remove a watermark from an item';
WatermarkingRemoveCommand.examples = ['box watermarking:remove folder 22222'];

WatermarkingRemoveCommand.flags = {
	...BoxCommand.flags,
};

WatermarkingRemoveCommand.args = {
	itemType: Args.string({
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item to remove watermark from',
		options: ['file', 'folder'],
	}),
	itemID: Args.string({
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the item to remove watermark from',
	}),
};

module.exports = WatermarkingRemoveCommand;
