'use strict';

const BoxCommand = require('../../box-command');

class CommentsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsGetCommand);

		let comment = await this.client.comments.get(args.id);
		await this.output(comment);
	}
}

CommentsGetCommand.description = 'Get information about a comment';

CommentsGetCommand.flags = {
	...BoxCommand.flags
};

CommentsGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the comment to get'
	}
];

module.exports = CommentsGetCommand;
