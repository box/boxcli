'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class SignTemplatesListCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(SignTemplatesListCommand);
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
	limit: flags.integer({
		description: 'The maximum number of items to return per page.',
	}),
	marker: flags.string({
		description:
			'Defines the position marker at which to begin returning results. This is used when paginating using marker-based pagination. This requires `usemarker` to be set to `true`.',
	}),
};

module.exports = SignTemplatesListCommand;
