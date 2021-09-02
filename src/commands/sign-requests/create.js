'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class SignRequestsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SignRequestsCreateCommand);

		const signRequest = await this.client.signRequests.create({
			signers: flags.signers.split(',').map((email) => ({
				role: 'signer',
				email,
			})),
			source_files: flags['source-files'].split(',').map((id) => ({
				type: 'file',
				id,
			})),
			parent_folder: {
				type: 'folder',
				id: flags['parent-folder'],
			},
		});

		await this.output(signRequest);
	}
}

SignRequestsCreateCommand.description = 'Create sign request';
SignRequestsCreateCommand.examples = [
	'box sign-requests:create -S alice@example.com -f 12345 -p 23456',
];
SignRequestsCreateCommand._endpoint = 'post_sign_requests';

SignRequestsCreateCommand.flags = {
	...BoxCommand.flags,
	signers: flags.string({
		char: 'S',
		required: true,
		description:
			'Signers as a comma separated list of e-mails, e.g. alice@example.com,bob@example.com',
	}),
	'source-files': flags.string({
		char: 'f',
		required: true,
		description:
			'Comma separated list of files to create a signing document from. This is currently limited to one file, e.g. 12345',
	}),
	'parent-folder': flags.string({
		char: 'p',
		required: true,
		description:
			'The destination folder to place final, signed document and signing log',
	}),
};

module.exports = SignRequestsCreateCommand;
