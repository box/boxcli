'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class HubsListItemsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsListItemsCommand);
		const queryParams = {
			hubId: args.id,
		};

		if (flags['parent-id']) {
			queryParams.parentId = flags['parent-id'];
		}

		const items = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.hubItems.getHubItemsV2025R0(pageQueryParams),
			queryParams
		);
		await this.output(items);
	}
}

HubsListItemsCommand.aliases = ['hubs:items:list'];
HubsListItemsCommand.description = 'List items in a Box Hub';
HubsListItemsCommand.examples = [
	'box hubs:items 12345',
	'box hubs:items 12345 --parent-id 67890 --max-items 50',
];
HubsListItemsCommand._endpoint = 'get_hub_items';

HubsListItemsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'parent-id': Flags.string({
		description:
			'Filter to items that belong to a specific item list block in the Box Hub',
	}),
};

HubsListItemsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsListItemsCommand;
