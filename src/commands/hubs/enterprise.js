'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../pagination-utils');

class HubsEnterpriseListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(HubsEnterpriseListCommand);
		let queryParams = {};

		if (flags.query) {
			queryParams.query = flags.query;
		}
		if (flags.sort) {
			queryParams.sort = flags.sort;
		}
		if (flags.direction) {
			queryParams.direction = flags.direction;
		}

		let hubs = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.hubs.getEnterpriseHubsV2025R0(pageQueryParams),
			queryParams
		);
		await this.output(hubs);
	}
}

HubsEnterpriseListCommand.description =
	'List Box Hubs across the enterprise. This call requires an admin or hub co-admin of an enterprise with GCM scope. Otherwise, Box returns a 403 status code with the message `The request requires higher privileges than provided by the access token.` See https://developer.box.com/guides/api-calls/permissions-and-errors/scopes#global-content-manager-gcm';
HubsEnterpriseListCommand.examples = [
	'box hubs:enterprise',
	'box hubs:enterprise --query "Roadmap" --sort updated_at --direction DESC',
];
HubsEnterpriseListCommand._endpoint = 'get_enterprise_hubs';

HubsEnterpriseListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	query: Flags.string({
		description: 'Search query for enterprise Box Hubs',
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

module.exports = HubsEnterpriseListCommand;
