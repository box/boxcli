'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class WatermarkingApplyCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(WatermarkingApplyCommand);
		let watermark;

		if (args.itemType === 'file') {
			watermark = await this.client.files.applyWatermark(args.itemID);
		} else if (args.itemType === 'folder') {
			watermark = await this.client.folders.applyWatermark(args.itemID);
		}
		await this.output(watermark);
	}
}

WatermarkingApplyCommand.description = 'Apply a watermark on an item';
WatermarkingApplyCommand.examples = ['box watermarking:apply folder 22222'];

WatermarkingApplyCommand.flags = {
	...BoxCommand.flags
};

WatermarkingApplyCommand.args = {
	itemType: Args.string({
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item to apply a watermark to',
		options: [
			'file',
			'folder'
		],
	}),
	itemID: Args.string({
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the item to apply a watermark to'
	}),
};

module.exports = WatermarkingApplyCommand;
