'use strict';

const BoxCommand = require('../../box-command');
const {flags} = require('@oclif/command');

class CommentsDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsDeleteCommand);

		await this.client.comments.delete(args.id);
		this.info(`Successfully deleted comment ${args.id}`);
	}
}

CommentsDeleteCommand.description = 'Delete a comment';

CommentsDeleteCommand.flags = {
	...BoxCommand.flags
};

CommentsDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the comment to delete'
	}
];

module.exports = CommentsDeleteCommand;
