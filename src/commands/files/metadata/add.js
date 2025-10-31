'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const utilities = require('../../../util');

class FilesCreateMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesCreateMetadataCommand);

		let metadataValues = Object.assign({}, ...flags.data);

		let metadata = await this.client.files.addMetadata(
			args.id,
			flags.scope,
			flags['template-key'],
			metadataValues
		);
		await this.output(metadata);
	}
}

FilesCreateMetadataCommand.aliases = ['files:metadata:create'];

FilesCreateMetadataCommand.description = 'Add metadata to a file';
FilesCreateMetadataCommand.examples = [
	'box files:metadata:add 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales',
	'box files:metadata:add 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"',
];
FilesCreateMetadataCommand._endpoint = 'post_files_id_metadata_id_id';

FilesCreateMetadataCommand.flags = {
	...BoxCommand.flags,
	data: Flags.string({
		description:
			'Metadata key and value, in the form "key=value".  Note: For float type, use "#" at the beginning of digits: key2=#1234.50',
		multiple: true,
		required: true,
		parse: utilities.parseMetadata,
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

FilesCreateMetadataCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to add metadata to',
	}),
};

module.exports = FilesCreateMetadataCommand;
