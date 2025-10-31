'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../util');

class FoldersUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersUpdateCommand);
		let updates = {};

		if (flags.name) {
			updates.name = flags.name;
		}
		if (flags.hasOwnProperty('can-non-owners-invite')) {
			updates.can_non_owners_invite = flags['can-non-owners-invite'];
		}
		if (flags.hasOwnProperty('can-non-owners-view-collaborators')) {
			updates.can_non_owners_view_collaborators =
				flags['can-non-owners-view-collaborators'];
		}
		if (flags.hasOwnProperty('description')) {
			updates.description = flags.description;
		}
		if (flags['upload-email-access']) {
			updates.folder_upload_email = {
				access: flags['upload-email-access'],
			};
		}
		if (flags.hasOwnProperty('restrict-collaboration')) {
			updates.can_non_owners_invite = !flags['restrict-collaboration'];
		}
		if (flags.hasOwnProperty('restrict-to-enterprise')) {
			updates.is_collaboration_restricted_to_enterprise =
				flags['restrict-to-enterprise'];
		}
		if (flags.tags) {
			updates.tags = flags.tags.split(',');
		}
		if (flags.hasOwnProperty('sync')) {
			updates.sync_state = flags.sync ? 'synced' : 'not_synced';
		}

		if (flags.etag) {
			updates.etag = flags.etag;
		}

		let updatedFolder = await this.client.folders.update(args.id, updates);
		await this.output(updatedFolder);
	}
}

FoldersUpdateCommand.description = 'Update a folder';
FoldersUpdateCommand.examples = [
	'box folders:update 22222 --name "New Folder Name"',
];
FoldersUpdateCommand._endpoint = 'put_folders_id';

FoldersUpdateCommand.flags = {
	...BoxCommand.flags,
	name: Flags.string({ description: 'New name for folder' }),
	'can-non-owners-invite': Flags.boolean({
		description:
			'Specifies if users who are not the owner of the folder can invite new collaborators to the folder.',
		allowNo: true,
	}),
	'can-non-owners-view-collaborators': Flags.boolean({
		description:
			'Restricts collaborators who are not the owner of this folder from viewing other collaborations on this folder.',
		allowNo: true,
	}),
	description: Flags.string({
		description: 'New description for folder',
		parse: utils.unescapeSlashes,
	}),
	'upload-email-access': Flags.string({
		description: 'Upload email access level',
		options: ['open', 'collaborators'],
	}),
	tags: Flags.string({ description: 'Comma seperated tags' }),
	sync: Flags.boolean({
		description: 'Whether the folder is synced to desktop',
		allowNo: true,
	}),
	'restrict-collaboration': Flags.boolean({
		description:
			'Restrict collaboration so only owners can invite new collaborators',
		allowNo: true,
	}),
	'restrict-to-enterprise': Flags.boolean({
		description:
			"Restrict collaboration so only users in the folder owner's enterprise can be added",
		allowNo: true,
	}),
	etag: Flags.string({
		description: 'Only apply updates if the etag value matches',
	}),
};

FoldersUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to update',
	}),
};

module.exports = FoldersUpdateCommand;
