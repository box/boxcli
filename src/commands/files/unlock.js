'use strict';

const BoxCommand = require('../../box-command');

class FilesUnlockCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesUnlockCommand);

		let file = await this.client.files.unlock(args.id);
		await this.output(file);
	}
}

FilesUnlockCommand.description = 'Unlock a file';
FilesUnlockCommand.examples = ['box files:unlock 11111'];

FilesUnlockCommand.flags = {
	...BoxCommand.flags
};

FilesUnlockCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'Id of file to unlock'
	}
];

module.exports = FilesUnlockCommand;
