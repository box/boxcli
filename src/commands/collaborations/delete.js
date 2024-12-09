'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class CollaborationsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(CollaborationsDeleteCommand);

		await this.client.collaborations.delete(args.id);
		this.info(`Collaboration ${args.id} successfully removed`);
	}
}

CollaborationsDeleteCommand.aliases = [
	'files:collaborations:delete',
	'folders:collaborations:delete'
];

CollaborationsDeleteCommand.description = 'Remove a collaboration';
CollaborationsDeleteCommand.examples = ['box collaborations:delete 12345'];
CollaborationsDeleteCommand._endpoint = 'delete_collaborations_id';

CollaborationsDeleteCommand.flags = {
	...BoxCommand.flags
};

CollaborationsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the collaboration to delete'
	}),
};

module.exports = CollaborationsDeleteCommand;
