'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class FilesDeleteMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesDeleteMetadataCommand);

		await this.client.files.deleteMetadata(
			args.id,
			flags.scope,
			flags['template-key']
		);
		this.info(`Successfully deleted metadata ${flags['template-key']}`);
	}
}

FilesDeleteMetadataCommand.aliases = ['files:metadata:delete'];

FilesDeleteMetadataCommand.description = 'Delete metadata from a file';
FilesDeleteMetadataCommand.examples = [
	'box files:metadata:remove 11111 --scope global --template-key properties',
];
FilesDeleteMetadataCommand._endpoint = 'delete_files_id_metadata_id_id';

FilesDeleteMetadataCommand.flags = {
	...BoxCommand.flags,
	scope: Flags.string({
		description: 'The scope of the metadata template to remove',
		default: 'enterprise',
	}),
	'template-key': Flags.string({
		description: 'The key of the metadata template to remove',
		required: true,
	}),
};

FilesDeleteMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to remove metadata from',
	}),
};

module.exports = FilesDeleteMetadataCommand;
