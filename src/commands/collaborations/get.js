'use strict';

const BoxCommand = require('../../box-command');
const { Args } = require('@oclif/core');

class CollaborationsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(CollaborationsGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let collaboration = await this.client.collaborations.get(
			args.id,
			options
		);
		await this.output(collaboration);
	}
}

CollaborationsGetCommand.description = 'Get an individual collaboration';
CollaborationsGetCommand.examples = ['box collaborations:get 12345'];
CollaborationsGetCommand._endpoint = 'get_collaborations_id';

CollaborationsGetCommand.flags = {
	...BoxCommand.flags,
};

CollaborationsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collaboration to get',
	}),
};

module.exports = CollaborationsGetCommand;
