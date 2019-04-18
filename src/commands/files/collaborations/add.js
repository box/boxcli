'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const CollaborationsCreateCommand = require('../../collaborations/create');
const CollaborationModule = require('../../../modules/collaboration');

class FilesCollaborationsAddCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FilesCollaborationsAddCommand);

		// Transform arguments for generic module
		args.itemType = 'file';
		args.itemID = args.id;
		delete args.id;

		let collabModule = new CollaborationModule(this.client);
		let collaboration = await collabModule.createCollaboration(args, flags);
		await this.output(collaboration);
	}
}

FilesCollaborationsAddCommand.description = 'Create a collaboration for a file';

FilesCollaborationsAddCommand.flags = {
	...CollaborationsCreateCommand.flags,
};

FilesCollaborationsAddCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to add a collaboration to'
	}
];

module.exports = FilesCollaborationsAddCommand;
