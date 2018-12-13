'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class FoldersDeleteMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersDeleteMetadataCommand);

		await this.client.folders.deleteMetadata(args.id, flags.scope, flags['template-key']);
		this.info(`Successfully deleted metadata ${flags['template-key']}`);
	}
}

FoldersDeleteMetadataCommand.aliases = [ 'folders:metadata:delete' ];

FoldersDeleteMetadataCommand.description = 'Delete metadata from a folder';

FoldersDeleteMetadataCommand.flags = {
	...BoxCommand.flags,
	scope: flags.string({
		description: 'The scope of the metadata template to remove',
		default: 'enterprise',
	}),
	'template-key': flags.string({
		description: 'The key of the metadata template to remove',
		required: true,
	}),
};

FoldersDeleteMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to remove metadata from'
	}
];

module.exports = FoldersDeleteMetadataCommand;
