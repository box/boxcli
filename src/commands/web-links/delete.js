'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class WebLinksDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(WebLinksDeleteCommand);

		await this.client.weblinks.delete(args.id);
		this.info(`Deleted weblink ${args.id}`);
	}
}

WebLinksDeleteCommand.description = 'Delete a web link';
WebLinksDeleteCommand.examples = ['box web-links:delete 12345'];
WebLinksDeleteCommand._endpoint = 'delete_web_links_id';

WebLinksDeleteCommand.flags = {
	...BoxCommand.flags
};

WebLinksDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the web link to delete',
	}),
};

module.exports = WebLinksDeleteCommand;
