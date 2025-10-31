'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class FoldersGetMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersGetMetadataCommand);

		let metadata = await this.client.folders.getMetadata(
			args.id,
			flags.scope,
			flags['template-key']
		);
		await this.output(metadata);
	}
}

FoldersGetMetadataCommand.description =
	'Get information about a metadata object';
FoldersGetMetadataCommand.examples = [
	'box folders:metadata:get 22222 --template-key employeeRecord',
];
FoldersGetMetadataCommand._endpoint = 'get_folders_id_metadata_id_id';

FoldersGetMetadataCommand.flags = {
	...BoxCommand.flags,
	scope: Flags.string({
		description: 'The scope of the metadata template to retrieve',
		default: 'enterprise',
	}),
	'template-key': Flags.string({
		description: 'The key of the metadata template to retrieve',
		required: true,
	}),
};

FoldersGetMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to get metadata on',
	}),
};

module.exports = FoldersGetMetadataCommand;
