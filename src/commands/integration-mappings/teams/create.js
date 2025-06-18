'use strict';

const BoxCommand = require('../../../box-command');
const { Args } = require('@oclif/core');

class IntegrationMappingsTeamsCreateCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(IntegrationMappingsTeamsCreateCommand);
		let body = {};
		body.boxItem = {
			type: 'folder',
			id: args.boxItemID
		};
		body.partnerItem = {
			type: args.partnerItemType,
			id: args.partnerItemID,
			teamId: args.partnerItemTeamID,
			tenantId: args.partnerItemTenantID
		};

		let integrationMapping = await this.tsClient.integrationMappings.createTeamsIntegrationMapping(body);
		delete integrationMapping.rawData;
		await this.output(integrationMapping);
	}
}

IntegrationMappingsTeamsCreateCommand.description = 'Create Teams integration mapping';
IntegrationMappingsTeamsCreateCommand.examples = [
	'box integration-mappings:teams:create 123 19%ABCD-Avgfggkggyftdtfgghjhkhkhh%40thread:tacv2 hjgjgjg-bhhj-564a-b643-hghgj685u abcd-defg-1235-7890',
];
IntegrationMappingsTeamsCreateCommand._endpoint = 'post_integration_mappings_teams';

IntegrationMappingsTeamsCreateCommand.args = {
	boxItemID: Args.string({
		name: 'boxItemID',
		required: true,
		hidden: false,
		description: 'ID of the mapped folder'
	}),
	partnerItemID: Args.string({
		name: 'partnerItemID',
		required: true,
		hidden: false,
		description: 'ID of the mapped item'
	}),
	partnerItemType: Args.string({
		name: 'partnerItemType',
		required: true,
		hidden: false,
		description: 'Type of the mapped item, value is one of: channel, team'
	}),
	partnerItemTeamID: Args.string({
		name: 'partnerItemTeamID',
		required: true,
		hidden: false,
		description: 'ID of the team that is registered with Microsoft Teams'
	}),
	partnerItemTenantID: Args.string({
		name: 'partnerItemTenantID',
		required: true,
		hidden: false,
		description: 'ID of the tenant that is registered with Microsoft Teams'
	})
};

module.exports = IntegrationMappingsTeamsCreateCommand;
