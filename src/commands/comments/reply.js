'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class CommentsReplyCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(CommentsReplyCommand);
		let params = {
			body: {
				item: {
					type: 'comment',
					id: args.id,
				},
			},
		};

		if (flags.message) {
			params.body.message = flags.message;
		} else if (flags['tagged-message']) {
			params.body.tagged_message = flags['tagged-message'];
		}

		// @TODO (2018-07-28): Should implement this using the Node SDK
		let comment = await this.client.wrapWithDefaultHandler(
			this.client.post
		)('/comments', params);
		await this.output(comment);
	}
}

CommentsReplyCommand.description = 'Reply to a comment';
CommentsReplyCommand.examples = [
	'box comments:reply 12345 --message "No problem!"',
];
// TODO: Determine if this is the correct variant ID
// CommentsReplyCommand._endpoint = 'post_comments reply';

CommentsReplyCommand.flags = {
	...BoxCommand.flags,
	message: Flags.string({
		description: 'Message of comment',
		exclusive: ['tagged-message'],
	}),
	'tagged-message': Flags.string({
		description:
			'The text of the comment, including @[userid:Username] somewhere in the message to mention the user',
		exclusive: ['message'],
	}),
};

CommentsReplyCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the comment to reply to',
	}),
};

module.exports = CommentsReplyCommand;
