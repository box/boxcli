'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class CommentsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsCreateCommand);
		let comment;

		if (flags.message) {
			comment = await this.client.comments.create(args.fileID, flags.message);
		} else if (flags['tagged-message']) {
			comment = await this.client.comments.createTaggedComment(args.fileID, flags['tagged-message']);
		}
		await this.output(comment);
	}
}

CommentsCreateCommand.description = 'Create a comment on a file';
CommentsCreateCommand.examples = [
	'box comments:create 11111 --message "Thanks for the update!"'
];
CommentsCreateCommand._endpoint = 'post_comments';

CommentsCreateCommand.flags = {
	...BoxCommand.flags,
	message: flags.string({
		description: 'Message of comment',
		exclusive: ['tagged-message']
	}),
	'tagged-message': flags.string({
		description: 'The text of the comment, including @[userid:Username] somewhere in the message to mention the user',
		exclusive: ['message']
	})
};

CommentsCreateCommand.args = [
	{
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of file on which to comment'
	}
];

module.exports = CommentsCreateCommand;
