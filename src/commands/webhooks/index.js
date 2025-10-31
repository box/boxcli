'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtils = require('../../pagination-utils');

class WebhooksListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(WebhooksListCommand);
		let options = PaginationUtils.handlePagination(flags);

		let webhooks = await this.client.webhooks.getAll(options);
		await this.output(webhooks);
	}
}

WebhooksListCommand.aliases = ['webhooks:list'];

WebhooksListCommand.description = 'List all webhooks';
WebhooksListCommand.examples = ['box webhooks'];
WebhooksListCommand._endpoint = 'get_webhooks';

WebhooksListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

module.exports = WebhooksListCommand;
