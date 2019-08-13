'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../../util');

class FilesSetMetadataCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesSetMetadataCommand);

		let metadataValues = Object.assign({}, ...flags.data);
		let templateKey = flags['template-key'];

		let metadata = await this.client.files.setMetadata(args.id, flags.scope, templateKey, metadataValues);
		await this.output(metadata);
	}

}

FilesSetMetadataCommand.description = 'Set metadata on a file';
FilesCreateMetadataCommand.examples = [
	'box files:metadata:set 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales'
];

FilesSetMetadataCommand.flags = {
	...BoxCommand.flags,
	data: flags.string({
		description: 'Metadata key and value, in the form "key=value".  Note: For float type, use "f" on end of digits: key2=1234.50f',
		required: true,
		multiple: true,
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

FilesSetMetadataCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to add metadata to',
	}
];

module.exports = FilesSetMetadataCommand;
