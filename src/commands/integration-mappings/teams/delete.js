'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class IntegrationMappingsTeamsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(
			IntegrationMappingsTeamsDeleteCommand
		);

		await this.tsClient.integrationMappings.deleteTeamsIntegrationMappingById(
			args.id
		);
		this.info(`Deleted Teams integration mapping ${args.id}`);
	}
}

IntegrationMappingsTeamsDeleteCommand.description =
	'Delete Teams integration mapping';
IntegrationMappingsTeamsDeleteCommand.examples = [
	'box integration-mappings:teams:delete 123',
];
IntegrationMappingsTeamsDeleteCommand._endpoint =
	'delete_integration_mappings_teams_id';

IntegrationMappingsTeamsDeleteCommand.flags = {
	...BoxCommand.flags,
};

IntegrationMappingsTeamsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the integration mapping',
	}),
};

module.exports = IntegrationMappingsTeamsDeleteCommand;
