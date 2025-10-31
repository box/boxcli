'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class FilesListVersionsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesListVersionsCommand);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let versions = await this.client.files.getVersions(
			args.fileID,
			options
		);
		await this.output(versions);
	}
}

FilesListVersionsCommand.aliases = ['files:versions:list'];

FilesListVersionsCommand.description = 'Get a list of file versions';
FilesListVersionsCommand.examples = ['box files:versions 11111'];
FilesListVersionsCommand._endpoint = 'get_files_id_versions';

FilesListVersionsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

FilesListVersionsCommand.args = {
	fileID: Args.string({
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of file to get versions for',
	}),
};

module.exports = FilesListVersionsCommand;
