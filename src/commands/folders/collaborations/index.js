'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class FoldersCollaborationsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersCollaborationsListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let collaborations = await this.client.folders.getCollaborations(args.id, options);
		await this.output(collaborations);
	}
}

FoldersCollaborationsListCommand.aliases = [ 'folders:collaborations:list' ];

FoldersCollaborationsListCommand.description = 'List all collaborations on a folder';

FoldersCollaborationsListCommand.flags = {
	...BoxCommand.flags,
};

FoldersCollaborationsListCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to get the collaborations on',
	}
];

module.exports = FoldersCollaborationsListCommand;
