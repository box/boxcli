'use strict';

const BoxCommand = require('../../box-command');

class WebLinksGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebLinksGetCommand);

		let weblink = await this.client.weblinks.get(args.id);
		await this.output(weblink);
	}
}

WebLinksGetCommand.description = 'Get information about a web link';

WebLinksGetCommand.flags = {
	...BoxCommand.flags
};

WebLinksGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the web link to get',
	}
];

module.exports = WebLinksGetCommand;
