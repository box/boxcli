'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class FileRequestsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FileRequestsGetCommand);

		let fileRequest = await this.client.fileRequests.getById(args.id);
		await this.output(fileRequest);
	}
}

FileRequestsGetCommand.description = 'Get information about an file request';
FileRequestsGetCommand.examples = ['box file-requests:get 12345'];
FileRequestsGetCommand._endpoint = 'get_file_requests_id';

FileRequestsGetCommand.flags = {
	...BoxCommand.flags,
};

FileRequestsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file request to get',
	}),
};

module.exports = FileRequestsGetCommand;
