'use strict';

const BoxCommand = require('../../../box-command');
const CollaborationsCreateCommand = require('../../collaborations/create');
const CollaborationModule = require('../../../modules/collaboration');

class FoldersCollaborationsAddCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FoldersCollaborationsAddCommand);

		// Transform arguments for generic module
		args.itemType = 'folder';
		args.itemID = args.id;
		delete args.id;

		let collabModule = new CollaborationModule(this.client);
		let collaboration = await collabModule.createCollaboration(args, flags);
		await this.output(collaboration);
	}
}

FoldersCollaborationsAddCommand.description = 'Create a collaboration for a folder';
FoldersCollaborationsAddCommand.examples = ['box folders:collaborations:add 22222 --role editor --user-id 33333'];

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
