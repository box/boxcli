'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class FilesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let file = await this.client.files.get(args.id, options);
		await this.output(file);
	}
}

FilesGetCommand.description = 'Get information about a file';
FilesGetCommand.examples = ['box files:get 11111'];
FilesGetCommand._endpoint = 'get_files_id';

FilesGetCommand.flags = {
	...BoxCommand.flags
};

FilesGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to get'
	})
};

module.exports = FilesGetCommand;
