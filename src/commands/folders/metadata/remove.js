'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class FoldersDeleteMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersDeleteMetadataCommand);

		await this.client.folders.deleteMetadata(
			args.id,
			flags.scope,
			flags['template-key']
		);
		this.info(`Successfully deleted metadata ${flags['template-key']}`);
	}
}

FoldersDeleteMetadataCommand.aliases = ['folders:metadata:delete'];

FoldersDeleteMetadataCommand.description = 'Delete metadata from a folder';
FoldersDeleteMetadataCommand.examples = [
	'box folders:metadata:remove 22222 --scope global --template-key properties',
];
FoldersDeleteMetadataCommand._endpoint = 'delete_folders_id_metadata_id_id';

FoldersDeleteMetadataCommand.flags = {
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

FoldersDeleteMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to remove metadata from',
	}),
};

module.exports = FoldersDeleteMetadataCommand;
