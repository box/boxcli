'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');

class TermsOfServiceListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(TermsOfServiceListCommand);
		let options = {};

		if (flags.type) {
			options.tos_type = flags.type;
		}

		let termsOfService = await this.client.termsOfService.getAll(options);
		await this.output(termsOfService);
	}
}

TermsOfServiceListCommand.description =
	'List terms of services for your enterprise';
TermsOfServiceListCommand.examples = ['box terms-of-service'];
TermsOfServiceListCommand._endpoint = 'get_terms_of_services';

TermsOfServiceListCommand.flags = {
	...BoxCommand.flags,
	type: Flags.string({
		description: 'Filter by terms of service type',
		options: ['managed', 'external'],
	}),
};

module.exports = TermsOfServiceListCommand;
