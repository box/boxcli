'use strict';

const BoxCommand = require('../../box-command');

class MetadataTemplatesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(MetadataTemplatesListCommand);

		let templates = await this.client.metadata.getTemplates('enterprise');
		await this.output(templates);
	}
}

MetadataTemplatesListCommand.aliases = [ 'metadata-templates:list' ];

MetadataTemplatesListCommand.description = 'Get all metadata templates in your Enterprise';
MetadataTemplatesListCommand.examples = ['box metadata-templates'];
MetadataTemplatesListCommand._endpoint = 'get_metadata_templates_enterprise';

MetadataTemplatesListCommand.flags = {
	...BoxCommand.flags
};

module.exports = MetadataTemplatesListCommand;
