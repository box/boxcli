'use strict';

const BoxCommand = require('../../box-command');

class WebhooksDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebhooksDeleteCommand);

		await this.client.webhooks.delete(args.id);
		this.info(`Deleted webhook ${args.id}`);
	}
}

WebhooksDeleteCommand.description = 'Delete a webhook';

WebhooksDeleteCommand.flags = {
	...BoxCommand.flags
};

WebhooksDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the webhook to delete',
	}
];

module.exports = WebhooksDeleteCommand;
