'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const SharedLinksModule = require('../../modules/shared-links');

class SharedLinksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(SharedLinksCreateCommand);

		let sharedLinksModule = new SharedLinksModule(this.client);
		let updatedItem = await sharedLinksModule.createSharedLink(args, flags);
		await this.output(updatedItem);
	}
}

SharedLinksCreateCommand.aliases = ['shared-links:update'];

SharedLinksCreateCommand.description = 'Create a shared link for a Box item';
SharedLinksCreateCommand.examples = [
	'box shared-links:create 22222 folder --access company --vanity-name my-custom-name-123',
];

const sharedLinkFlags = {
	...BoxCommand.flags,
	access: Flags.string({ description: 'Shared link access level' }),
	password: Flags.string({ description: 'Shared link password' }),
	'unshared-at': Flags.string({
		description:
			'Time that this link will become disabled. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s from now.',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'can-download': Flags.boolean({
		description: 'Whether the shared link allows downloads',
		allowNo: true,
	}),
	'vanity-name': Flags.string({
		description:
			'Defines a custom vanity name to use in the shared link URL. It should be between 12 and 30 characters. This field can contains only letters, numbers and hyphens.',
	}),
};

const sharedLinkFileFlags = {
	'can-edit': Flags.boolean({
		description:
			'Whether the shared link allows edits. Only Applicable for files.',
		allowNo: true,
	}),
};

SharedLinksCreateCommand.flags = {
	...sharedLinkFlags,
	...sharedLinkFileFlags,
};

SharedLinksCreateCommand.args = {
	itemID: Args.string({
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'ID of the Box item to share',
	}),
	itemType: Args.string({
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'Type of item for shared link: either file or folder',
		options: ['file', 'folder'],
	}),
};

module.exports = {
	SharedLinksCreateCommand,
	sharedLinkFlags,
	sharedLinkFileFlags,
};
