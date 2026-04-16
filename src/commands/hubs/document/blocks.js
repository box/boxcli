'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class HubsListDocumentBlocksCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsListDocumentBlocksCommand);
		const queryParams = {
			hubId: args.id,
			pageId: args.pageId,
		};

		const blocks = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.hubDocument.getHubDocumentBlocksV2025R0(
					pageQueryParams
				),
			queryParams
		);
		await this.output(blocks);
	}
}

HubsListDocumentBlocksCommand.aliases = ['hubs:document:blocks:list'];
HubsListDocumentBlocksCommand.description =
	'Retrieve sorted Hub Document Blocks for a specific hub document page, excluding items. Results are organized by parent_id and include only blocks on that page, not sub pages or their content blocks.';
HubsListDocumentBlocksCommand.examples = [
	'box hubs:document:blocks 12345 55c8361a-012a-4fa1-a724-b7ef1cd87865',
	'box hubs:document:blocks 12345 55c8361a-012a-4fa1-a724-b7ef1cd87865 --max-items 50',
];
HubsListDocumentBlocksCommand._endpoint = 'get_hub_document_blocks';

HubsListDocumentBlocksCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

HubsListDocumentBlocksCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
	pageId: Args.string({
		name: 'page-id',
		required: true,
		hidden: false,
		description: 'ID of the page in the Box Hub document',
	}),
};

module.exports = HubsListDocumentBlocksCommand;
