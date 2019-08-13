'use strict';

const BoxCommand = require('../../box-command');

class CommentsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let comment = await this.client.comments.get(args.id, options);
		await this.output(comment);
	}
}

CommentsGetCommand.description = 'Get information about a comment';
CommentsGetCommand.examples = [
	'box comments:get 12345'
];
CommentsGetCommand._endpoint = 'get_comments_id';

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
