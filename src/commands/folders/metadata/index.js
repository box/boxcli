'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class FoldersGetAllMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersGetAllMetadataCommand);

		let metadata = await this.client.folders.getAllMetadata(args.id);
		await this.output(metadata);
	}
}

FoldersGetAllMetadataCommand.aliases = [ 'folders:metadata:get-all' ];

FoldersGetAllMetadataCommand.description = 'Get all metadata on a folder';
FoldersGetAllMetadataCommand.examples = ['box folders:metadata 22222'];
FoldersGetAllMetadataCommand._endpoint = 'get_folders_id_metadata';

FoldersGetAllMetadataCommand.flags = {
	...BoxCommand.flags
};

FoldersGetAllMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to get all metadata on',
	}),
};

module.exports = FoldersGetAllMetadataCommand;
