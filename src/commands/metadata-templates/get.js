'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class MetadataTemplatesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataTemplatesGetCommand);

		// @TODO: Support get metadata template by ID
		let template = await this.client.metadata.getTemplateSchema(flags.scope, args.templateKey);
		await this.output(template);
	}
}

MetadataTemplatesGetCommand.description = 'Get information about a metadata template';

MetadataTemplatesGetCommand.flags = {
	...BoxCommand.flags,
	scope: flags.string({
		description: 'The scope of the metadata template to get',
		default: 'enterprise',
	}),
};

MetadataTemplatesGetCommand.args = [
	{
		name: 'templateKey',
		required: true,
		hidden: false,
		description: 'The template key of the template to get',
	}
];

module.exports = MetadataTemplatesGetCommand;
