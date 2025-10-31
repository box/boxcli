'use strict';

const BoxCommand = require('../../../box-command');
const { Args } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class FilesCollaborationsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			FilesCollaborationsListCommand
		);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let collaborations = await this.client.files.getCollaborations(
			args.id,
			options
		);
		await this.output(collaborations);
	}
}

FilesCollaborationsListCommand.aliases = ['files:collaborations:list'];

FilesCollaborationsListCommand.description =
	'List all collaborations on a file';
FilesCollaborationsListCommand.examples = ['box files:collaborations 11111'];
FilesCollaborationsListCommand._endpoint = 'get_files_id_collaborations';

FilesCollaborationsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

FilesCollaborationsListCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to get collaborations for',
	}),
};

module.exports = FilesCollaborationsListCommand;
