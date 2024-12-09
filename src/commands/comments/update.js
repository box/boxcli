'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class CommentsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(CommentsUpdateCommand);
		let updates = {};

		if (flags.message) {
			updates.message = flags.message;
		}
		if (flags['tagged-message']) {
			updates.tagged_message = flags['tagged-message'];
		}

		let comment = await this.client.comments.update(args.id, updates);
		await this.output(comment);
	}
}

CommentsUpdateCommand.description = 'Update a comment';
CommentsUpdateCommand.examples = ['box comments:update 12345 --message "Thank you for the update!"'];
CommentsUpdateCommand._endpoint = 'put_comments_id';

CommentsUpdateCommand.flags = {
	...BoxCommand.flags,
	message: Flags.string({
		description: 'The text of the comment',
		exclusive: ['tagged-message']
	}),
	'tagged-message': Flags.string({
		description: 'The tagged text of the comment',
		exclusive: ['message']
	})
};

CommentsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the comment to update'
	}),
};

module.exports = CommentsUpdateCommand;
