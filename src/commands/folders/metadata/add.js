'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../../util');

class FoldersCreateMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersCreateMetadataCommand);

		let metadataValues = Object.assign({}, ...flags.data);
		let templateKey = flags['template-key'];

		let metadata = await this.client.folders.addMetadata(args.id, flags.scope, templateKey, metadataValues);
		await this.output(metadata);
	}

}

FoldersCreateMetadataCommand.aliases = [ 'folders:metadata:create' ];

FoldersCreateMetadataCommand.description = 'Add metadata to a folder';
FoldersCreateMetadataCommand.examples = [
	'box folders:metadata:add 22222 --template-key employeeRecord --data "name=John Doe" --data department=Sales',
	'box folders:metadata:add 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"',
];
FoldersCreateMetadataCommand._endpoint = 'post_folders_id_metadata_id_id';

FoldersCreateMetadataCommand.flags = {
	...BoxCommand.flags,
	data: Flags.string({
		description: 'Metadata key and value, in the form "key=value".  Note: For float type, use "#" at the beginning of digits: key2=#1234.50',
		required: true,
		multiple: true,
		parse: utils.parseMetadata,
	}),
	scope: Flags.string({
		description: 'The scope of the metadata template to use',
		default: 'enterprise',
	}),
	'template-key': Flags.string({
		description: 'The key of the metadata template to use',
		required: true,
	}),
};

FoldersCreateMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to add metadata to',
	}),
};

module.exports = FoldersCreateMetadataCommand;
