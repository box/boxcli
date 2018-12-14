'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class CommentsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsUpdateCommand);
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

CommentsUpdateCommand.flags = {
	...BoxCommand.flags,
	message: flags.string({
		description: 'The text of the comment',
		exclusive: ['tagged-message']
	}),
	'tagged-message': flags.string({
		description: 'The tagged text of the comment',
		exclusive: ['message']
	})
};

CommentsUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the comment to update'
	}
];

module.exports = CommentsUpdateCommand;
