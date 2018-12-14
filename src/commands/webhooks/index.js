'use strict';

const BoxCommand = require('../../box-command');

class WebhooksListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebhooksListCommand);

		let webhooks = await this.client.webhooks.getAll();
		await this.output(webhooks);
	}
}

WebhooksListCommand.aliases = [ 'webhooks:list' ];

WebhooksListCommand.description = 'List all webhooks';

WebhooksListCommand.flags = {
	...BoxCommand.flags
};

module.exports = WebhooksListCommand;
