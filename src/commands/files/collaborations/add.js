'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const CollaborationsCreateCommand = require('../../collaborations/create');
const CollaborationModule = require('../../../modules/collaboration');

class FilesCollaborationsAddCommand extends BoxCommand {
	async run() {
		const { args, flags } = this.parse(FilesCollaborationsAddCommand);

		// Clone the args and insert the "file" type at the correct position for the generic command
		// let argv = this.argv.slice();
		// argv.splice(argv.indexOf(args.id) + 1, 0, 'file');
		// return CollaborationsCreateCommand.run(argv);

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
