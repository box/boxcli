'use strict';

const BoxCommand = require('../../box-command');

class WatermarkingGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WatermarkingGetCommand);
		let watermark;

		if (args.itemType === 'file') {
			watermark = await this.client.files.getWatermark(args.itemID);
		} else if (args.itemType === 'folder') {
			watermark = await this.client.folders.getWatermark(args.itemID);
		}

		// Node SDK has inconsistent output, so we wrap this to provide a
		// consistent interface with watermarking:apply
		await this.output({ watermark });
	}
}

WatermarkingGetCommand.description = 'Get the watermark on an item';
WatermarkingGetCommand.examples = [
	'box watermarking:get folder 22222'
]

WatermarkingGetCommand.flags = {
	...BoxCommand.flags
};

WatermarkingGetCommand.args = [
	{
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item to get watermark for',
		options: [
			'file',
			'folder'
		]
	},
	{
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the item to get watermark for',
	}
];

module.exports = WatermarkingGetCommand;
