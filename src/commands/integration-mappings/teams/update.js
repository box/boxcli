'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class IntegrationMappingsTeamsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(IntegrationMappingsTeamsUpdateCommand);
		let body = {};

		if (flags['box-item-id']) {
			body.boxItem = {
				id: flags['box-item-id'],
				type: 'folder'
			};
		}

		let integrationMapping = await this.tsClient.integrationMappings.updateTeamsIntegrationMappingById(args.id, {
			requestBody: body
		});
		delete integrationMapping.rawData;
		await this.output(integrationMapping);
	}
}

IntegrationMappingsTeamsUpdateCommand.description = 'Update Teams integration mapping';
IntegrationMappingsTeamsUpdateCommand.examples = ['box integration-mappings:teams:update 123 --box-item-id 789'];
IntegrationMappingsTeamsUpdateCommand._endpoint = 'put_integration_mappings_teams_id';

IntegrationMappingsTeamsUpdateCommand.flags = {
	...BoxCommand.flags,
	'box-item-id': Flags.string({
		description: 'ID of the mapped folder',
	}),
};

IntegrationMappingsTeamsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of an integration mapping',
	}),
};

module.exports = IntegrationMappingsTeamsUpdateCommand;
