'use strict';

const BoxCommand = require('../../../box-command');
const CollaborationsCreateCommand = require('../../collaborations/create');
const CollaborationModule = require('../../../modules/collaboration');

class FoldersCollaborationsAddCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FoldersCollaborationsAddCommand);

		// Clone the args and insert the "folder" type at the correct position for the generic command
		// let argv = this.argv.slice();
		// argv.splice(argv.indexOf(args.id) + 1, 0, 'folder');
		// return CollaborationsCreateCommand.run(argv);

		args.itemType = 'folder';
		args.itemID = args.id;
		delete args.id;

		let collabModule = new CollaborationModule(this.client);
		let collaboration = await collabModule.createCollaboration(args, flags);
		await this.output(collaboration);
	}
}

FoldersCollaborationsAddCommand.description = 'Create a collaboration for a folder';

FoldersCollaborationsAddCommand.flags = {
	...CollaborationsCreateCommand.flags,
};

FoldersCollaborationsAddCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to add a collaboration to',
	}
];

module.exports = FoldersCollaborationsAddCommand;
