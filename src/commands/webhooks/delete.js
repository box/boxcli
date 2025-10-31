'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class WebhooksDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(WebhooksDeleteCommand);

		await this.client.webhooks.delete(args.id);
		this.info(`Deleted webhook ${args.id}`);
	}
}

WebhooksDeleteCommand.description = 'Delete a webhook';
WebhooksDeleteCommand.examples = ['box webhooks:delete 12345'];
WebhooksDeleteCommand._endpoint = 'delete_webhooks_id';

WebhooksDeleteCommand.flags = {
	...BoxCommand.flags,
};

WebhooksDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the webhook to delete',
	}),
};

module.exports = WebhooksDeleteCommand;
