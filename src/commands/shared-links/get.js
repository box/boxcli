'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class SharedLinksGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SharedLinksGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let sharedItem = await this.client.sharedItems.get(args.url, args.password, options);
		await this.output(sharedItem);
	}
}

SharedLinksGetCommand.description = 'Get information from a shared item URL';

SharedLinksGetCommand.flags = {
	...BoxCommand.flags,
	password: flags.string({
		description: 'Shared item password',
		default: null
	})
};

SharedLinksGetCommand.args = [
	{
		name: 'url',
		required: true,
		hidden: false,
		description: 'Shared item URL to resolve',
	}
];

module.exports = SharedLinksGetCommand;
