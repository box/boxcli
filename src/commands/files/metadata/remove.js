'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class FilesDeleteMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesDeleteMetadataCommand);

		await this.client.files.deleteMetadata(args.id, flags.scope, flags['template-key']);
		this.info(`Successfully deleted metadata ${flags['template-key']}`);
	}
}

FilesDeleteMetadataCommand.aliases = [ 'files:metadata:delete' ];

FilesDeleteMetadataCommand.description = 'Delete metadata from a file';

FilesDeleteMetadataCommand.flags = {
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

FilesDeleteMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to remove metadata from',
	}
];

module.exports = FilesDeleteMetadataCommand;
