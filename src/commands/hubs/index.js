'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../pagination-utils');

class HubsListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(HubsListCommand);
		const queryParams = {};

		if (flags.query) {
			queryParams.query = flags.query;
		}
		if (flags.scope) {
			queryParams.scope = flags.scope;
		}
		if (flags.sort) {
			queryParams.sort = flags.sort;
		}
		if (flags.direction) {
			queryParams.direction = flags.direction;
		}

		const hubs = await this.markerPagination(
			(pageQueryParams) => this.tsClient.hubs.getHubsV2025R0(pageQueryParams),
			queryParams
		);
		await this.output(hubs);
	}
}

HubsListCommand.aliases = ['hubs:list'];
HubsListCommand.description = 'List Box Hubs for the current user';
HubsListCommand.examples = [
	'box hubs',
	'box hubs --query "Product" --scope editable --sort name --direction ASC',
];
HubsListCommand._endpoint = 'get_hubs';

HubsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	query: Flags.string({
		description: 'Search query for Box Hubs',
	}),
	scope: Flags.string({
		description:
			'Scope of hubs to retrieve. One of: editable, view_only, all',
		options: ['editable', 'view_only', 'all'],
	}),
	sort: Flags.string({
		description:
			'Sort field for hubs. One of: name, updated_at, last_accessed_at, view_count, relevance',
		options: [
			'name',
			'updated_at',
			'last_accessed_at',
			'view_count',
			'relevance',
		],
	}),
	direction: Flags.string({
		description: 'Sort direction. One of: ASC, DESC',
		options: ['ASC', 'DESC'],
	}),
};

module.exports = HubsListCommand;
