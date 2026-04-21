'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class HubsListCollaborationsCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsListCollaborationsCommand);
		const queryParams = {
			hubId: args.id,
		};

		const collaborations = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.hubCollaborations.getHubCollaborationsV2025R0(
					pageQueryParams
				),
			queryParams
		);
		await this.output(collaborations);
	}
}

HubsListCollaborationsCommand.aliases = ['hubs:collaborations:list'];
HubsListCollaborationsCommand.description = 'List collaborations for a Box Hub';
HubsListCollaborationsCommand.examples = [
	'box hubs:collaborations 12345',
	'box hubs:collaborations 12345 --max-items 50',
];
HubsListCollaborationsCommand._endpoint = 'get_hub_collaborations';

HubsListCollaborationsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

HubsListCollaborationsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsListCollaborationsCommand;
