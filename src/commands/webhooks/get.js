'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class WebhooksGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(WebhooksGetCommand);

		let webhook = await this.client.webhooks.get(args.id);
		await this.output(webhook);
	}
}

WebhooksGetCommand.description = 'Get information about a webhook';
WebhooksGetCommand.examples = ['box webhooks:get 12345'];
WebhooksGetCommand._endpoint = 'get_webhooks_id';

WebhooksGetCommand.flags = {
	...BoxCommand.flags,
};

WebhooksGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the webhook to get',
	}),
};

module.exports = WebhooksGetCommand;
