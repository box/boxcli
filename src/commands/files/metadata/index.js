'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class FilesGetAllMetadataCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(FilesGetAllMetadataCommand);

		let metadata = await this.client.files.getAllMetadata(args.id);
		await this.output(metadata);
	}
}

FilesGetAllMetadataCommand.aliases = ['files:metadata:get-all'];

FilesGetAllMetadataCommand.description = 'Get all metadata on a file';
FilesGetAllMetadataCommand.examples = ['box files:metadata 11111'];
FilesGetAllMetadataCommand._endpoint = 'get_files_id_metadata';

FilesGetAllMetadataCommand.flags = {
	...BoxCommand.flags,
};

FilesGetAllMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'Id of the file',
	}),
};

module.exports = FilesGetAllMetadataCommand;
