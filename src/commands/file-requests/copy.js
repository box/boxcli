'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FileRequestsCopyCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FileRequestsCopyCommand);
		let options = { folder: { type: 'folder' }};

		if (args.folderID) {
			options.folder.id = args.folderID;
		}

		if (flags.title) {
			options.title = flags.title;
		}

		if (flags.description) {
			options.description = flags.description;
		}

		if (flags['expires-at']) {
			options.expires_at = flags['expires-at'];
		}

		if (flags['description-required']) {
			options.is_description_required = flags['description-required'];
		}

		if (flags['email-required']) {
			options.is_email_required = flags['email-required'];
		}

		if (flags.status) {
			options.status = flags.status;
		}

		let fileRequest = await this.client.fileRequests.copy(args.id, options);
		await this.output(fileRequest);
	}
}

FileRequestsCopyCommand.description =
	'Copies existing file request to new folder';
FileRequestsCopyCommand.examples = ['box file-requests:copy 22222 44444'];
FileRequestsCopyCommand._endpoint = 'post_file_requests_id_copy';

FileRequestsCopyCommand.flags = {
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
};
FileRequestsCopyCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file request to copy',
	},
	{
		name: 'folderID',
		required: true,
		hidden: false,
		description: 'ID of folder to which file request will be copied',
	},
];

module.exports = FileRequestsCopyCommand;
