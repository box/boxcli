'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtils = require('../../../pagination-utils');

class IntegrationMappingsTeamsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(IntegrationMappingsTeamsListCommand);
		let options = {};

		if (flags['partner-item-id']) {
			options.partnerItemId = flags['partner-item-id'];
		}
		if (flags['partner-item-type']) {
			options.partnerItemType = flags['partner-item-type'];
		}
		if (flags['box-item-id']) {
			options.boxItemId = flags['box-item-id'];
		}
		if (flags['box-item-type']) {
			options.boxItemType = flags['box-item-type'];
		}

		let teamsIntegrationMappings =
			await this.tsClient.integrationMappings.getTeamsIntegrationMapping(
				options
			);
		delete teamsIntegrationMappings.rawData;
		await this.output(teamsIntegrationMappings);
	}
}

IntegrationMappingsTeamsListCommand.aliases = [
	'integration-mappings:teams:list',
];

IntegrationMappingsTeamsListCommand.description =
	'List Teams integration mappings';
IntegrationMappingsTeamsListCommand.examples = [
	'box integration-mappings:teams --partner-item-id 123 --partner-item-type channel',
	'box integration-mappings:teams --box-item-id 456 --box-item-type folder',
];
IntegrationMappingsTeamsListCommand._endpoint =
	'get_integration_mappings_teams';

IntegrationMappingsTeamsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	'partner-item-id': Flags.string({
		hidden: false,
		description:
			'ID of the mapped item, for which the mapping should be returned',
	}),
	'partner-item-type': Flags.string({
		hidden: false,
		description:
			'Mapped item type, for which the mapping should be returned, value is one of: channel, team',
	}),
	'box-item-id': Flags.string({
		hidden: false,
		description: 'Box item ID, for which the mappings should be returned',
	}),
	'box-item-type': Flags.string({
		hidden: false,
		description:
			'Box item type, for which the mappings should be returned, value is one of: folder',
	}),
};

module.exports = IntegrationMappingsTeamsListCommand;
