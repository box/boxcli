'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const SharedLinksModule = require('../../modules/shared-links');

class SharedLinksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SharedLinksCreateCommand);
		
		let sharedLinksModule = new SharedLinksModule(this.client);
		let updatedItem = await sharedLinksModule.createSharedLink(args, flags);
		await this.output(updatedItem);
	}
}

SharedLinksCreateCommand.aliases = ['shared-links:update'];

SharedLinksCreateCommand.description = 'Create a shared link for a Box item';
SharedLinksCreateCommand.examples = ['box shared-links:create 22222 folder --access company'];

const sharedLinkFlags = {
	...BoxCommand.flags,
	access: flags.string({ description: 'Shared link access level' }),
	password: flags.string({ description: 'Shared link password' }),
	'unshared-at': flags.string({
		description: 'Time that this link will become disabled. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s from now.',
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'can-download': flags.boolean({
		description: 'Whether the shared link allows downloads',
		allowNo: true
	})
};

const sharedLinkFileFlags = {
	'can-edit': flags.boolean({
		description: 'Whether the shared link allows edits. Only Applicable for files.',
		allowNo: true,
	}),
};

SharedLinksCreateCommand.flags = {
	...sharedLinkFlags,
	...sharedLinkFileFlags
};

SharedLinksCreateCommand.args = [
	{
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the Box item to share',
	},
	{
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item for shared link: either file or folder',
		options: [
			'file',
			'folder'
		],
	}
];

module.exports = { SharedLinksCreateCommand, sharedLinkFlags, sharedLinkFileFlags };
