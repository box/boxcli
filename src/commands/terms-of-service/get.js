'use strict';

const BoxCommand = require('../../box-command');

class TermsOfServiceGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TermsOfServiceGetCommand);

		let termsOfService = await this.client.termsOfService.get(args.id);
		await this.output(termsOfService);
	}
}

TermsOfServiceGetCommand.description = 'Get information on a terms of service';

TermsOfServiceGetCommand.flags = {
	...BoxCommand.flags
};

TermsOfServiceGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID for the terms of service to get',
	}
];

module.exports = TermsOfServiceGetCommand;
