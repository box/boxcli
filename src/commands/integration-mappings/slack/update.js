'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class IntegrationMappingsSlackUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(IntegrationMappingsSlackUpdateCommand);
		let options = {integration_mapping_id: args.id};
		let body = {};

		if (flags['box-item-id']) {
			body.box_item = {
				id: flags['box-item-id'],
				type: 'folder'
			};
		}
		if (flags.hasOwnProperty('disable-access-management')) {
			body.options = {
				is_access_management_disabled: flags['disable-access-management']
			};
		}

		let integrationMapping = await this.client.integrationMappings.updateSlackIntegrationMapping(body, options);
		await this.output(integrationMapping);
	}
}

IntegrationMappingsSlackUpdateCommand.description = 'Update Slack integration mapping';
IntegrationMappingsSlackUpdateCommand.examples = ['box integration-mappings:slack:update 123 --box-item-id 789 --disable-access-management'];
IntegrationMappingsSlackUpdateCommand._endpoint = 'put_integration_mappings_slack_id';

IntegrationMappingsSlackUpdateCommand.flags = {
	...BoxCommand.flags,
	'box-item-id': flags.string({
		description: 'ID of the mapped folder',
	}),
	'disable-access-management': flags.boolean({
		description: 'Indicates whether or not channel member access to the underlying box item should be automatically managed. ' +
			'Depending on type of channel, access is managed through creating collaborations or shared links.',
		allowNo: true,
	})
};

IntegrationMappingsSlackUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of an integration mapping',
	}
];

module.exports = IntegrationMappingsSlackUpdateCommand;
