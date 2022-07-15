'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FileRequestsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FileRequestsUpdateCommand);
		let updates = {};
		let etag = '';

		if (flags.description) {
			updates.description = flags.description;
		}

		if (flags['expires-at']) {
			updates.expires_at = flags['expires-at'];
		}

		if (flags['description-required']) {
			updates.is_description_required = flags['description-required'];
		}

		if (flags['email-required']) {
			updates.is_email_required = flags['email-required'];
		}

		if (flags.status) {
			updates.status = flags.status;
		}

		if (flags.title) {
			updates.title = flags.title;
		}

		if (flags.etag) {
			etag = flags.etag;
		}

		let fileRequest = await this.client.fileRequests.update(
			args.id,
			updates,
			etag
		);
		await this.output(fileRequest);
	}
}

FileRequestsUpdateCommand.description = 'Update a file request';
FileRequestsUpdateCommand.examples = [
	'box file-requests:update 12345 --description "New file request description!"',
];
FileRequestsUpdateCommand._endpoint = 'put_file_requests_id';

FileRequestsUpdateCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({
		description: 'New description of file request',
	}),
	'expires-at': flags.string({
		description: 'New date when file request expires',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'description-required': flags.boolean({
		description:
			'is file request submitter required to provide a description of the files they are submitting',
		allowNo: true,
	}),
	'email-required': flags.boolean({
		description: 'New date when file request expires',
		allowNo: true,
	}),
	status: flags.string({
		description: 'New status of file request',
		options: ['active', 'inactive'],
	}),
	title: flags.string({
		description: 'New title of file request',
	}),
	etag: flags.string({
		description: `Pass in the item's last observed etag value into this header and the endpoint will fail with a 412 Precondition Failed if it has changed since.`,
	}),
};

FileRequestsUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file request to update',
	},
];

module.exports = FileRequestsUpdateCommand;
