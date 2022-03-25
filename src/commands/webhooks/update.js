'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class WebhooksUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebhooksUpdateCommand);
		let updates = {};

		if (flags.triggers) {
			updates.triggers = flags.triggers.split(',');
		}
		if (flags.address) {
			updates.address = flags.address;
		}

		let webhook = await this.client.webhooks.update(args.id, updates);
		await this.output(webhook);
	}
}

WebhooksUpdateCommand.description = 'Update a webhook';
WebhooksUpdateCommand.examples = ['box webhooks:update 12345 --triggers FILE.DELETED,FOLDER.DELETED'];
WebhooksUpdateCommand._endpoint = 'put_webhooks_id';

WebhooksUpdateCommand.flags = {
	...BoxCommand.flags,
	triggers: flags.string({
		char: 'T',
		description: 'Triggers for webhook, enter as comma separated list. For example: FILE.DELETED,FILE.PREVIEWED'
	}),
	address: flags.string({
		char: 'a',
		description: 'URL for your webhook handler'
	})
};

WebhooksUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the webhook to update',
	}
];

module.exports = WebhooksUpdateCommand;
