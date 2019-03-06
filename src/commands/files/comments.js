'use strict';

const BoxCommand = require('../../box-command');

class CommentsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let comments = await this.client.files.getComments(args.id, options);
		await this.output(comments);
	}
}

CommentsListCommand.aliases = [ 'comments:list' ];

CommentsListCommand.description = 'List all comments on a file';

CommentsListCommand.flags = {
	...BoxCommand.flags
};

CommentsListCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to get comments for'
	}
];

module.exports = CommentsListCommand;
