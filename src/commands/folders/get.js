'use strict';

const BoxCommand = require('../../box-command');
const { Args } = require('@oclif/core');

class FoldersGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let folder = await this.client.folders.get(args.id, options);
		await this.output(folder);
	}
}

FoldersGetCommand.description = 'Get information about a folder';
FoldersGetCommand.examples = ['box folders:get 22222'];
FoldersGetCommand._endpoint = 'get_folders_id';

FoldersGetCommand.flags = {
	...BoxCommand.flags,
};

FoldersGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of folder to get; use 0 for the root folder',
	}),
};

module.exports = FoldersGetCommand;
