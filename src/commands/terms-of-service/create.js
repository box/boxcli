'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');

class TermsOfServiceCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(TermsOfServiceCreateCommand);

		let termsOfService = await this.client.termsOfService.create(flags.type, flags.status, flags.text);
		await this.output(termsOfService);
	}
}

TermsOfServiceCreateCommand.description = 'Create a terms of service';
TermsOfServiceCreateCommand.examples = ['box terms-of-service:create --type external --status enabled --text "By using this service, you agree to...."'];
TermsOfServiceCreateCommand._endpoint = 'post_terms_of_services';

TermsOfServiceCreateCommand.flags = {
	...BoxCommand.flags,
	type: Flags.string({
		description: 'Type of terms of service',
		required: true,
		options: [
			'managed',
			'external'
		]
	}),
	status: Flags.string({
		description: 'Status of the terms of service',
		required: true,
		options: [
			'enabled',
			'disabled'
		]
	}),
	text: Flags.string({
		description: 'Text for the terms of service',
		required: true,
	}),
};

module.exports = TermsOfServiceCreateCommand;
