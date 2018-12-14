'use strict';

const BoxCommand = require('../../box-command');
const SharedLinksDeleteCommand = require('../shared-links/delete');

class FoldersUnshareCommand extends BoxCommand {
	run() {
		const { args } = this.parse(FoldersUnshareCommand);

		// Clone the args and insert the "folder" type at the correct position for the generic command
		let argv = this.argv.slice();
		argv.splice(argv.indexOf(args.id) + 1, 0, 'folder');
		return SharedLinksDeleteCommand.run(argv);
	}
}

FoldersUnshareCommand.aliases = [ 'folders:shared-links:delete' ];

FoldersUnshareCommand.description = 'Delete a shared link for a folder';

FoldersUnshareCommand.flags = {
	...SharedLinksDeleteCommand.flags,
};

FoldersUnshareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to unshare',
	}
];

module.exports = FoldersUnshareCommand;
