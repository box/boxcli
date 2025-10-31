'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class MetadataTemplatesDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			MetadataTemplatesDeleteCommand
		);

		await this.client.metadata.deleteTemplate(
			flags.scope,
			args.templateKey
		);
		this.info(
			`Delete metadata template with scope ${flags.scope} and identifier ${args.templateKey}`
		);
	}
}

MetadataTemplatesDeleteCommand.description = 'Delete a metadata template';
MetadataTemplatesDeleteCommand.examples = [
	'box metadata-templates:delete employeeRecord',
];
MetadataTemplatesDeleteCommand._endpoint =
	'delete_metadata_templates_id_id_schema';

MetadataTemplatesDeleteCommand.flags = {
	...BoxCommand.flags,
	scope: Flags.string({
		description: 'The scope of the metadata template to delete',
		default: 'enterprise',
	}),
};

MetadataTemplatesDeleteCommand.args = {
	templateKey: Args.string({
		name: 'templateKey',
		required: true,
		hidden: false,
		description: 'The template key of the metadata template to delete',
	}),
};

module.exports = MetadataTemplatesDeleteCommand;
