'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FilesLockCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesLockCommand);
		let options = {};

		if (flags.expires) {
			options.expires_at = flags.expires;
		}
		if (flags.hasOwnProperty('prevent-download')) {
			options.is_download_prevented = flags['prevent-download'];
		}

		let file = await this.client.files.lock(args.id, options);
		await this.output(file);
	}
}

FilesLockCommand.aliases = ['files:update-lock'];

FilesLockCommand.description = 'Lock a file';
FilesLockCommand.examples = ['box files:lock 11111'];

FilesLockCommand.flags = {
	...BoxCommand.flags,
	expires: flags.string({
		description: 'Make the lock expire from a timespan set from now. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s',
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'prevent-download': flags.boolean({
		description: 'Prevent download of locked file',
		allowNo: true
	})
};

FilesLockCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of file to lock'
	}
];

module.exports = FilesLockCommand;
