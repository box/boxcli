'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const CollaborationsCreateCommand = require('../../collaborations/create');

class FoldersCollaborationsAddCommand extends BoxCommand {
	run() {
		const { args } = this.parse(FoldersCollaborationsAddCommand);

		// Clone the args and insert the "folder" type at the correct position for the generic command
		let argv = this.argv.slice();
		argv.splice(argv.indexOf(args.id) + 1, 0, 'folder');
		return CollaborationsCreateCommand.run(argv);
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
