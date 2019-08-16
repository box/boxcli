'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FoldersCopyCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersCopyCommand);
		let options = {};

		if (flags.name) {
			options.name = flags.name;
		}

		let folderCopy = await this.client.folders.copy(args.id, args.parentID, options);
		await this.output(folderCopy);
	}
}

FoldersCopyCommand.description = 'Copy a folder to a different folder';
FoldersCopyCommand.examples = [
	'box folders:copy 22222 44444'
];
FoldersCopyCommand._endpoint = 'post_folders_id_copy';

FoldersCopyCommand.flags = {
	...BoxCommand.flags,
	name: flags.string({ description: 'An optional new name for the folder' }),
	'id-only': flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
};

FoldersCopyCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to copy',
	},
	{
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of the new parent folder to copy the folder into',
	}
];

module.exports = FoldersCopyCommand;
