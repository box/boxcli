'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');
const PaginationUtilities = require('../../pagination-utils');

class CommentsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(CommentsListCommand);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let comments = await this.client.files.getComments(args.id, options);
		await this.output(comments);
	}
}

CommentsListCommand.aliases = ['comments:list'];

CommentsListCommand.description = 'List all comments on a file';
CommentsListCommand.examples = ['box files:comments 11111'];
CommentsListCommand._endpoint = 'get_files_id_comments';

CommentsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.pagingFlag,
};

CommentsListCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file to get comments for',
	}),
};

module.exports = CommentsListCommand;
