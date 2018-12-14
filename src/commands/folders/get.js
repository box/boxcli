'use strict';

const BoxCommand = require('../../box-command');

class FoldersGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersGetCommand);

		let folder = await this.client.folders.get(args.id);
		await this.output(folder);
	}
}

FoldersGetCommand.description = 'Get information about a folder';

FoldersGetCommand.flags = {
	...BoxCommand.flags
};

FoldersGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of folder to get; use 0 for the root folder'
	}
];

module.exports = FoldersGetCommand;
