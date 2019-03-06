'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class CollaborationsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationsGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let collaboration = await this.client.collaborations.get(args.id, options);
		await this.output(collaboration);
	}
}

CollaborationsGetCommand.description = 'Get an individual collaboration';

CollaborationsGetCommand.flags = {
	...BoxCommand.flags,
};

CollaborationsGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collaboration to get'
	}
];

module.exports = CollaborationsGetCommand;
