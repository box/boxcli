'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class FilesGetMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesGetMetadataCommand);

		let metadata = await this.client.files.getMetadata(args.id, flags.scope, flags['template-key']);
		await this.output(metadata);
	}
}

FilesGetMetadataCommand.description = 'Get information about a metadata object';
FilesGetMetadataCommand.examples = [
	'box files:metadata:get 11111 --template-key employeeRecord'
];
FilesGetMetadataCommand._endpoint = 'get_files_id_metadata_id_id';

FilesGetMetadataCommand.flags = {
	...BoxCommand.flags,
	scope: flags.string({
		description: 'The scope of the metadata template to retrieve',
		default: 'enterprise',
	}),
	'template-key': flags.string({
		description: 'The key of the metadata template to retrieve',
		required: true,
	}),
};

FilesGetMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to get metadata on',
	}
];

module.exports = FilesGetMetadataCommand;
