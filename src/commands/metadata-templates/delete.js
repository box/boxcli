'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class MetadataTemplatesDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataTemplatesDeleteCommand);

		await this.client.metadata.deleteTemplate(flags.scope, args.templateKey);
		this.info(`Delete metadata template with scope ${flags.scope} and identifier ${args.templateKey}`);
	}
}

MetadataTemplatesDeleteCommand.description = 'Delete a metadata template';

MetadataTemplatesDeleteCommand.flags = {
	...BoxCommand.flags,
	scope: flags.string({
		description: 'The scope of the metadata template to delete',
		default: 'enterprise',
	}),
};

MetadataTemplatesDeleteCommand.args = [
	{
		name: 'templateKey',
		required: true,
		hidden: false,
		description: 'The template key of the metadata template to delete',
	}
];

module.exports = MetadataTemplatesDeleteCommand;
