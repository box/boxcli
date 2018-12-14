'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class TermsOfServiceUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TermsOfServiceUpdateCommand);
		let options = {};

		if (flags.status) {
			options.status = flags.status;
		}
		if (flags.text) {
			options.text = flags.text;
		}

		let termsOfService = await this.client.termsOfService.update(args.id, options);
		await this.output(termsOfService);
	}
}

TermsOfServiceUpdateCommand.description = 'Update a terms of service';

TermsOfServiceUpdateCommand.flags = {
	...BoxCommand.flags,
	status: flags.string({
		description: 'Status of the terms of service',
		options: [
			'enabled',
			'disabled'
		]
	}),
	text: flags.string({ description: 'Text for the terms of service' })
};

TermsOfServiceUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the terms of service to update',
	}
];

module.exports = TermsOfServiceUpdateCommand;
