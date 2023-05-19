'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtils = require('../../pagination-utils');

class CommentsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CommentsListCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let comments = await this.client.files.getComments(args.id, options);
		await this.output(comments);
	}
}

CommentsListCommand.aliases = [ 'comments:list' ];

CommentsListCommand.description = 'List all comments on a file';
CommentsListCommand.examples = ['box files:comments 11111'];
CommentsListCommand._endpoint = 'get_files_id_comments';

CommentsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.pagingFlag,
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
