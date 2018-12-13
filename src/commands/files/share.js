'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const SharedLinksCreateCommand = require('../shared-links/create');

class FilesShareCommand extends BoxCommand {
	run() {
		const { args } = this.parse(FilesShareCommand);

		// Clone the args and insert the "file" type at the correct position for the generic command
		let argv = this.argv.slice();
		argv.splice(argv.indexOf(args.id) + 1, 0, 'file');
		return SharedLinksCreateCommand.run(argv);
	}
}

FilesShareCommand.aliases = [
	'files:shared-links:create',
	'files:shared-links:update'
];

FilesShareCommand.description = 'Create a shared link for a file';

FilesShareCommand.flags = {
	...SharedLinksCreateCommand.flags,
};

FilesShareCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to share'
	}
];

module.exports = FilesShareCommand;
