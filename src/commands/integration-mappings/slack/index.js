'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const PaginationUtils = require('../../../pagination-utils');

class IntegrationMappingsSlackListCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(IntegrationMappingsSlackListCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags['partner-item-id']) {
			options.partner_item_id = flags['partner-item-id'];
		}
		if (flags['box-item-id']) {
			options.box_item_id = flags['box-item-id'];
		}
		if (flags.hasOwnProperty('manually-created')) {
			options.is_manually_created = flags['manually-created'];
		}

		let slackIntegrationMappings = await this.client.integrationMappings.getSlackIntegrationMappings(options);
		await this.output(slackIntegrationMappings);
	}
}

IntegrationMappingsSlackListCommand.aliases = [ 'integration-mappings:slack:list' ];

IntegrationMappingsSlackListCommand.description = 'List Slack integration mappings';
IntegrationMappingsSlackListCommand.examples = [
	'box integration-mappings:slack --partner-item-id 123 --manually-created',
	'box integration-mappings:slack --box-item-id 456 --no-manually-created'
];
IntegrationMappingsSlackListCommand._endpoint = 'get_integration_mappings_slack';

IntegrationMappingsSlackListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	'partner-item-id': flags.string({
		hidden: false,
		description: 'ID of the mapped Slack channel, for which the mapping should be returned',
	}),
	'box-item-id': flags.string({
		hidden: false,
		description: 'ID of the mapped Box folder, for which the mapping should be returned',
	}),
	'manually-created': flags.boolean({
		description: 'Whether the mapping has been manually created',
		allowNo: true
	})
};

module.exports = IntegrationMappingsSlackListCommand;
