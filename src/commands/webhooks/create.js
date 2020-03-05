'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class WebhooksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(WebhooksCreateCommand);

		let triggers = flags.triggers.split(',');

		let webhook = await this.client.webhooks.create(args.targetID, args.targetType, flags.address, triggers);
		await this.output(webhook);
	}
}

WebhooksCreateCommand.description = 'Create a new webhook';
WebhooksCreateCommand.examples = ['box webhooks:create folder 22222 --triggers FILE.DELETED --address https://example.com/webhook/deletion'];
WebhooksCreateCommand._endpoint = 'post_webhooks';

WebhooksCreateCommand.flags = {
	...BoxCommand.flags,
	'id-only': flags.boolean({
		description: 'Return only an ID to output from this command'
	}),
	triggers: flags.string({
		char: 'T',
		required: true,
		description: 'Triggers for webhook as a comma separated list, e.g. FILE.DELETED,FILE.PREVIEWED',
	}),
	address: flags.string({
		char: 'a',
		required: true,
		description: 'URL for your webhook handler'
	}),
};

WebhooksCreateCommand.args = [
	{
		name: 'targetType',
		required: true,
		hidden: false,
		description: 'Type of Box item to create a webhook on',
		options: [
			'file',
			'folder'
		]
	},
	{
		name: 'targetID',
		required: true,
		hidden: false,
		description: 'ID of the Box item to create a webhook on',
	}
];

module.exports = WebhooksCreateCommand;
