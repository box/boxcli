'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class FoldersUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersUpdateCommand);
		let updates = {};

		if (flags.name) {
			updates.name = flags.name;
		}
		if (flags.hasOwnProperty('description')) {
			updates.description = flags.description;
		}
		if (flags['upload-email-access']) {
			updates.folder_upload_email = {
				access: flags['upload-email-access']
			};
		}
		if (flags.hasOwnProperty('restrict-collaboration')) {
			updates.can_non_owners_invite = flags['restrict-collaboration'];
		}
		if (flags.hasOwnProperty('restrict-to-enterprise')) {
			updates.is_collaboration_restricted_to_enterprise = flags['restrict-to-enterprise'];
		}
		if (flags.tags) {
			updates.tags = (flags.tags).split(',');
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

FoldersUpdateCommand.flags = {
	...BoxCommand.flags,
	name: flags.string({ description: 'New name for folder' }),
	description: flags.string({ description: 'New description for folder' }),
	'upload-email-access': flags.string({
		description: 'Upload email access level',
		options: [
			'open',
			'collaborators'
		],
	}),
	tags: flags.string({ description: 'Comma seperated tags' }),
	sync: flags.boolean({
		description: 'Whether the folder is synced to desktop',
		allowNo: true
	}),
	'restrict-collaboration': flags.boolean({
		description: 'Restrict collaboration so only owners can invite new collaborators',
		allowNo: true
	}),
	'restrict-to-enterprise': flags.boolean({
		description: 'Restrict collaboration so only users in the folder owner\'s enterprise can be added',
		allowNo: true,
	}),
	etag: flags.string({ description: 'Only apply updates if the etag value matches' }),
};

FoldersUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to update',
	}
];

module.exports = FoldersUpdateCommand;
