'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class FilesLockCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FilesLockCommand);
		let options = {};

		if (flags.expires) {
			options.expires_at = flags.expires;
		}
		if (Object.hasOwn(flags, 'prevent-download')) {
			options.is_download_prevented = flags['prevent-download'];
		}

		let file = await this.client.files.lock(args.id, options);
		await this.output(file);
	}
}

FilesLockCommand.aliases = ['files:update-lock'];

FilesLockCommand.description = 'Lock a file';
FilesLockCommand.examples = ['box files:lock 11111'];
FilesLockCommand._endpoint = 'put_files_id lock';

FilesLockCommand.flags = {
	...BoxCommand.flags,
	expires: Flags.string({
		description:
			'Make the lock expire from a timespan set from now. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'prevent-download': Flags.boolean({
		description: 'Prevent download of locked file',
		allowNo: true,
	}),
};

FilesLockCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of file to lock',
	}),
};

module.exports = FilesLockCommand;
