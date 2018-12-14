'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class SharedLinksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(SharedLinksCreateCommand);
		let updates = { shared_link: { permissions: {} } };
		let updatedItem;

		if (flags.access) {
			updates.shared_link.access = flags.access;
		}
		if (flags.password) {
			updates.shared_link.password = flags.password;
		}
		if (flags['unshared-at']) {
			updates.shared_link.unshared_at = this.getDateFromString(flags['unshared-at']);
		}
		if (flags.hasOwnProperty('can-download')) {
			updates.shared_link.permissions.can_download = flags['can-download'];
		}

		if (args.itemType === 'file') {
			updatedItem = await this.client.files.update(args.itemID, updates);
		} else if (args.itemType === 'folder') {
			updatedItem = await this.client.folders.update(args.itemID, updates);
		}
		await this.output(updatedItem.shared_link);
	}
}

SharedLinksCreateCommand.aliases = ['shared-links:update'];

SharedLinksCreateCommand.hidden = true;

SharedLinksCreateCommand.description = 'Create a shared link for a Box item';

SharedLinksCreateCommand.flags = {
	...BoxCommand.flags,
	access: flags.string({ description: 'Shared link access level' }),
	password: flags.string({ description: 'Shared link password' }),
	'unshared-at': flags.string({ description: 'Time that this link will become disabled. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s from now.' }),
	'can-download': flags.boolean({
		description: 'Whether the shared link allows downloads',
		allowNo: true
	})
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

module.exports = SharedLinksCreateCommand;
