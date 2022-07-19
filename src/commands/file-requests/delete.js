'use strict';

const BoxCommand = require('../../box-command');

class FileRequestsDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FileRequestsDeleteCommand);

		await this.client.fileRequests.delete(args.id);
		this.info(`Deleted file request ${args.id}`);
	}
}

FileRequestsDeleteCommand.description = 'Delete individual file request';
FileRequestsDeleteCommand.examples = ['box file-requests:delete 12345'];
FileRequestsDeleteCommand._endpoint = 'delete_file_requests_id';

FileRequestsDeleteCommand.flags = {
	...BoxCommand.flags,
};

FileRequestsDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file request to delete',
	},
];

module.exports = FileRequestsDeleteCommand;
