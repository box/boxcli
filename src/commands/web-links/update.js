'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class WebLinksUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebLinksUpdateCommand);
		let updates = {};

		if (flags.description) {
			updates.description = flags.description;
		}
		if (flags.name) {
			updates.name = flags.name;
		}
		if (flags.url) {
			updates.url = flags.url;
		}

		let weblink = await this.client.weblinks.update(args.id, updates);
		await this.output(weblink);
	}
}

WebLinksUpdateCommand.description = 'Update a web link';
WebLinksUpdateCommand.examples = [
	'box web-links:update 12345 --name "Example Site"'
];
WebLinksUpdateCommand._endpoint = 'put_web_links_id';

WebLinksUpdateCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({
		char: 'd',
		description: 'Description of the web link'
	}),
	name: flags.string({
		char: 'n',
		description: 'Name of the web link'
	}),
	url: flags.string({
		char: 'u',
		description: 'The URL the web link points to. Must start with "http://" or "https://"'
	})
};

WebLinksUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the web link to update',
	}
];

module.exports = WebLinksUpdateCommand;
