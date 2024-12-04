'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class SignTemplatesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(SignTemplatesListCommand);
		const { limit, marker } = flags;

		const signTemplates = await this.client.signTemplates.getAll({
			limit,
			marker,
		});

		await this.output(signTemplates);
	}
}

SignTemplatesListCommand.description = 'List sign templates';
SignTemplatesListCommand.examples = ['box sign-templates'];
SignTemplatesListCommand._endpoint = 'get_sign_templates';

SignTemplatesListCommand.flags = {
	...BoxCommand.flags,
	limit: Flags.integer({
		description: 'The maximum number of items to return per page.',
	}),
	marker: Flags.string({
		description:
			'Defines the position marker at which to begin returning results. This is used when paginating using marker-based pagination. This requires `usemarker` to be set to `true`.',
	}),
};

module.exports = SignTemplatesListCommand;
