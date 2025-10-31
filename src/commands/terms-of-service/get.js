'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class TermsOfServiceGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(TermsOfServiceGetCommand);

		let termsOfService = await this.client.termsOfService.get(args.id);
		await this.output(termsOfService);
	}
}

TermsOfServiceGetCommand.description = 'Get information on a terms of service';
TermsOfServiceGetCommand.examples = ['box terms-of-service:get 55555'];
TermsOfServiceGetCommand._endpoint = 'get_terms_of_services_id';

TermsOfServiceGetCommand.flags = {
	...BoxCommand.flags,
};

TermsOfServiceGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID for the terms of service to get',
	}),
};

module.exports = TermsOfServiceGetCommand;
