'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../../util');

class FilesCreateMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesCreateMetadataCommand);

		let metadataValues = Object.assign({}, ...flags.data);

		let metadata = await this.client.files.addMetadata(args.id, flags.scope, flags['template-key'], metadataValues);
		await this.output(metadata);
	}

}

FilesCreateMetadataCommand.aliases = [ 'files:metadata:create' ];

FilesCreateMetadataCommand.description = 'Add metadata to a file';
FilesCreateMetadataCommand.examples = [
	'box files:metadata:add 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales'
];
FilesCreateMetadataCommand._endpoint = 'post_files_id_metadata_id_id';

FilesCreateMetadataCommand.flags = {
	...BoxCommand.flags,
	data: flags.string({
		description: 'Metadata key and value, in the form "key=value".  Note: For float type, use "f" on end of digits: key2=1234.50f',
		multiple: true,
		required: true,
		parse: utils.parseMetadata,
	}),
	scope: flags.string({
		description: 'The scope of the metadata template to use',
		default: 'enterprise',
	}),
	'template-key': flags.string({
		description: 'The key of the metadata template to use',
		required: true,
	}),
};

FilesCreateMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to add metadata to'
	}
];

module.exports = FilesCreateMetadataCommand;
