'use strict';

const BoxCommand = require('../../box-command');

class SignTemplatesGetCommand extends BoxCommand {
	async run() {
		const { args } = this.parse(SignTemplatesGetCommand);

		const signTemplate = await this.client.signTemplates.getById({
			template_id: args.id,
		});
		await this.output(signTemplate);
	}
}

SignTemplatesGetCommand.description = 'Get sign template by ID';
SignTemplatesGetCommand.examples = ['box sign-templates:get 12345'];
SignTemplatesGetCommand._endpoint = 'get_sign_templates_id';

SignTemplatesGetCommand.flags = {
	...BoxCommand.flags,
};

SignTemplatesGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the sign template',
	},
];

module.exports = SignTemplatesGetCommand;
