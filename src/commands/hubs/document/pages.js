'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class HubsListDocumentPagesCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsListDocumentPagesCommand);
		const queryParams = {
			hubId: args.id,
		};

		const pages = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.hubDocument.getHubDocumentPagesV2025R0(
					pageQueryParams
				),
			queryParams
		);
		await this.output(pages);
	}
}

HubsListDocumentPagesCommand.aliases = ['hubs:document:pages:list'];
HubsListDocumentPagesCommand.description = 'Retrieves a list of Hub Document Pages for the specified hub. Includes both root-level pages and sub pages';
HubsListDocumentPagesCommand.examples = [
	'box hubs:document:pages 12345',
	'box hubs:document:pages 12345 --max-items 50',
];
HubsListDocumentPagesCommand._endpoint = 'get_hub_document_pages';

HubsListDocumentPagesCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

HubsListDocumentPagesCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsListDocumentPagesCommand;
