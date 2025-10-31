'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class CommentsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(CommentsDeleteCommand);

		await this.client.comments.delete(args.id);
		this.info(`Successfully deleted comment ${args.id}`);
	}
}

CommentsDeleteCommand.description = 'Delete a comment';
CommentsDeleteCommand.examples = ['box comments:delete 12345'];
CommentsDeleteCommand._endpoint = 'delete_comments_id';

CommentsDeleteCommand.flags = {
	...BoxCommand.flags,
};

CommentsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the comment to delete',
	}),
};

module.exports = CommentsDeleteCommand;
