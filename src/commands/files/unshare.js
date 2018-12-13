'use strict';

const BoxCommand = require('../../box-command');
const SharedLinksDeleteCommand = require('../shared-links/delete');

class FilesUnshareCommand extends BoxCommand {
	run() {
		const { args } = this.parse(FilesUnshareCommand);

		// Clone the args and insert the "file" type at the correct position for the generic command
		let argv = this.argv.slice();
		argv.splice(argv.indexOf(args.id) + 1, 0, 'file');
		return SharedLinksDeleteCommand.run(argv);
	}
}

FilesUnshareCommand.aliases = ['files:shared-links:delete'];

FilesUnshareCommand.description = 'Delete a shared link for a file';

FilesUnshareCommand.flags = {
	...SharedLinksDeleteCommand.flags,
};

FilesUnshareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to unshare'
	}
];

module.exports = FilesUnshareCommand;
