'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const SharedLinksCreateCommand = require('../shared-links/create');

class FoldersShareCommand extends BoxCommand {
	run() {
		const { args } = this.parse(FoldersShareCommand);

		// Clone the args and insert the "folder" type at the correct position for the generic command
		let argv = this.argv.slice();
		argv.splice(argv.indexOf(args.id) + 1, 0, 'folder');
		return SharedLinksCreateCommand.run(argv);
	}
}

FoldersShareCommand.aliases = [
	'folders:shared-links:create',
	'folders:shared-links:update'
];

FoldersShareCommand.description = 'Create a shared link for a folder';

FoldersShareCommand.flags = {
	...SharedLinksCreateCommand.flags,
};

FoldersShareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to share',
	}
];

module.exports = FoldersShareCommand;
