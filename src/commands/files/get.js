'use strict';

const BoxCommand = require('../../box-command');

class FilesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesGetCommand);

		let file = await this.client.files.get(args.id);
		await this.output(file);
	}
}

FilesGetCommand.description = 'Get information about a file';

FilesGetCommand.flags = {
	...BoxCommand.flags
};

FilesGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to get'
	}
];

module.exports = FilesGetCommand;
