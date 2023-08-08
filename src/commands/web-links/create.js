'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../util');

class WebLinksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebLinksCreateCommand);
		let options = {};

		if (flags.description) {
			options.description = flags.description;
		}
		if (flags.name) {
			options.name = flags.name;
		}

		let weblink = await this.client.weblinks.create(args.url, flags['parent-id'], options);
		await this.output(weblink);
	}
}

WebLinksCreateCommand.description = 'Create a new web link';
WebLinksCreateCommand.examples = ['box web-links:create http://example.com --parent-id 0'];
WebLinksCreateCommand._endpoint = 'post_web_links';

WebLinksCreateCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({
		char: 'd',
		description: 'Description of the web link',
		parse: utils.unescapeSlashes
	}),
	name: flags.string({
		char: 'n',
		description: 'Name of the web link. Defaults to the URL if not set'
	}),
	'parent-id': flags.string({
		required: true,
		description: 'ID of the folder to create the web link in',
	}),
};

WebLinksCreateCommand.args = [
	{
		name: 'url',
		required: true,
		hidden: false,
		description: 'The URL the web link points to. Must start with "http://" or "https://"',
	}
];

module.exports = WebLinksCreateCommand;
