'use strict';

const BoxCommand = require('../../box-command');

class WebLinksMoveCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebLinksMoveCommand);
		let updates = { parent: { id: args.parentID } };

		let weblink = await this.client.weblinks.update(args.id, updates);
		await this.output(weblink);
	}
}

WebLinksMoveCommand.description = 'Move a web link';
WebLinksMoveCommand.examples = ['box web-links:move 12345 22222'];

WebLinksMoveCommand.flags = {
	...BoxCommand.flags
};

WebLinksMoveCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the web link to move',
	},
	{
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of the parent folder to move the web link into',
	}
];

module.exports = WebLinksMoveCommand;
