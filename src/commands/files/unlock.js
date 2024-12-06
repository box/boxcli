'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class FilesUnlockCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesUnlockCommand);

		let file = await this.client.files.unlock(args.id);
		await this.output(file);
	}
}

FilesUnlockCommand.description = 'Unlock a file';
FilesUnlockCommand.examples = ['box files:unlock 11111'];
FilesUnlockCommand._endpoint = 'put_files_id unlock';

FilesUnlockCommand.flags = {
	...BoxCommand.flags
};

FilesUnlockCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'Id of file to unlock'
	}),
};

module.exports = FilesUnlockCommand;
