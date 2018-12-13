'use strict';

const BoxCommand = require('../../box-command');

class WebLinksDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebLinksDeleteCommand);

		await this.client.weblinks.delete(args.id);
		this.info(`Deleted weblink ${args.id}`);
	}
}

WebLinksDeleteCommand.description = 'Delete a web link';

WebLinksDeleteCommand.flags = {
	...BoxCommand.flags
};

WebLinksDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the web link to delete',
	}
];

module.exports = WebLinksDeleteCommand;
