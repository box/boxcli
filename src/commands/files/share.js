'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const SharedLinksCreateCommand = require('../shared-links/create');
const SharedLinksModule = require('../../modules/shared-links');

class FilesShareCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FilesShareCommand);

		// Clone the args and insert the "file" type at the correct position for the generic command
		// let argv = this.argv.slice();
		// argv.splice(argv.indexOf(args.id) + 1, 0, 'file');
		// return SharedLinksCreateCommand.run(argv);

		args.itemType = 'file';
		args.itemID = args.id;
		delete args.id;

		let sharedLinksModule = new SharedLinksModule(this.client);
		let updatedItem = await sharedLinksModule.createSharedLink(args, flags);
		await this.output(updatedItem.shared_link);
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
