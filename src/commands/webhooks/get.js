'use strict';

const BoxCommand = require('../../box-command');

class WebhooksGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebhooksGetCommand);

		let webhook = await this.client.webhooks.get(args.id);
		await this.output(webhook);
	}
}

WebhooksGetCommand.description = 'Get information about a webhook';

WebhooksGetCommand.flags = {
	...BoxCommand.flags
};

WebhooksGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the webhook to get',
	}
];

module.exports = WebhooksGetCommand;
