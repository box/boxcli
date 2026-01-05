'use strict';

const BoxCommand = require('../../../box-command');
const BoxCLIError = require('../../../cli-error');
const { Flags, Args } = require('@oclif/core');

class IntegrationMappingsSlackCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			IntegrationMappingsSlackCreateCommand
		);
		let body = {
			box_item: {
				type: 'folder',
				id: args.boxItemID,
			},
			partner_item: {
				type: 'channel',
				id: args.channelID,
			},
		};
		if (flags['slack-workspace-id']) {
			body.partner_item.slack_workspace_id = flags['slack-workspace-id'];
		} else if (flags['slack-org-id']) {
			body.partner_item.slack_org_id = flags['slack-org-id'];
		} else {
			throw new BoxCLIError(
				'Either the --slack-workspace-id or --slack-org-id flag must be passed'
			);
		}
		if (Object.hasOwn(flags, 'disable-access-management')) {
			body.options = {
				is_access_management_disabled:
					flags['disable-access-management'],
			};
		}

		let integrationMapping =
			await this.client.integrationMappings.createSlackIntegrationMapping(
				body
			);
		await this.output(integrationMapping);
	}
}

IntegrationMappingsSlackCreateCommand.description =
	'Create Slack integration mapping';
IntegrationMappingsSlackCreateCommand.examples = [
	'box integration-mappings:slack:create 123 AB89X56Y --slack-org-id 789',
	'box integration-mappings:slack:create 123 AB89X56Y --slack-workspace-id 999 --disable-access-management',
];
IntegrationMappingsSlackCreateCommand._endpoint =
	'post_integration_mappings_slack';

IntegrationMappingsSlackCreateCommand.flags = {
	...BoxCommand.flags,
	'slack-workspace-id': Flags.string({
		description:
			'ID of the Slack workspace with which the item would be associated',
		exclusive: ['slack-org-id'],
	}),
	'slack-org-id': Flags.string({
		description:
			'ID of the Slack organization with which the item would be associated',
		exclusive: ['slack-workspace-id'],
	}),
	'disable-access-management': Flags.boolean({
		description:
			'Indicates whether or not channel member access to the underlying box item should be automatically managed. ' +
			'Depending on type of channel, access is managed through creating collaborations or shared links.',
		allowNo: true,
	}),
};

IntegrationMappingsSlackCreateCommand.args = {
	boxItemID: Args.string({
		name: 'boxItemID',
		required: true,
		hidden: false,
		description: 'ID of the mapped folder',
	}),
	channelID: Args.string({
		name: 'channelID',
		required: true,
		hidden: false,
		description: 'ID of the mapped Slack channel',
	}),
};

module.exports = IntegrationMappingsSlackCreateCommand;
