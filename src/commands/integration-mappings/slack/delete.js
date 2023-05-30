'use strict';

const BoxCommand = require('../../../box-command');

class IntegrationMappingsSlackDeleteCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(IntegrationMappingsSlackDeleteCommand);

		await this.client.integrationMappings.deleteSlackIntegrationMappingById({ integration_mapping_id: args.id });
		this.info(`Deleted Slack integration mapping ${args.id}`);
	}
}

IntegrationMappingsSlackDeleteCommand.description = 'Delete Slack integration mapping';
IntegrationMappingsSlackDeleteCommand.examples = ['box integration-mappings:slack:delete 123'];
IntegrationMappingsSlackDeleteCommand._endpoint = 'delete_integration_mappings_slack_id';

IntegrationMappingsSlackDeleteCommand.flags = {
	...BoxCommand.flags
};

IntegrationMappingsSlackDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the integration mapping',
	}
];

module.exports = IntegrationMappingsSlackDeleteCommand;
