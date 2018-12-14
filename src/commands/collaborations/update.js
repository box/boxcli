'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class CollaborationsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationsUpdateCommand);
		let params = { body: {}, qs: {} };

		if (flags.fields) {
			params.qs.fields = flags.fields;
		}
		if (flags.status) {
			params.body.status = flags.status;
		}
		if (flags.hasOwnProperty('can-view-path')) {
			params.body.can_view_path = flags['can-view-path'];
		}
		if (flags.role) {
			params.body.role = flags.role.replace('_', ' ');
		} else if (flags.editor) {
			params.body.role = this.client.collaborationRoles.EDITOR;
		} else if (flags.viewer) {
			params.body.role = this.client.collaborationRoles.VIEWER;
		} else if (flags.previewer) {
			params.body.role = this.client.collaborationRoles.PREVIEWER;
		} else if (flags.uploader) {
			params.body.role = this.client.collaborationRoles.UPLOADER;
		} else if (flags['previewer-uploader']) {
			params.body.role = this.client.collaborationRoles.PREVIEWER_UPLOADER;
		} else if (flags['viewer-uploader']) {
			params.body.role = this.client.collaborationRoles.VIEWER_UPLOADER;
		} else if (flags['co-owner']) {
			params.body.role = this.client.collaborationRoles.CO_OWNER;
		} else if (flags.owner) {
			params.body.role = this.client.collaborationRoles.OWNER;
		}
		if (flags['expires-at']) {
			params.body.expires_at = this.getDateFromString(flags['expires-at']);
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		let collaboration = await this.client.wrapWithDefaultHandler(this.client.put)(`/collaborations/${args.id}`, params);
		await this.output(collaboration);
	}
}

CollaborationsUpdateCommand.aliases = [
	'files:collaborations:update',
	'folders:collaborations:update'
];

CollaborationsUpdateCommand.description = 'Update a collaboration';

CollaborationsUpdateCommand.flags = {
	...BoxCommand.flags,
	role: flags.string({
		char: 'r',
		description: 'An option to manually enter the role',
		exclusive: [
			'editor',
			'viewer',
			'previewer',
			'uploader',
			'previewer-uploader',
			'viewer-uploader',
			'co-owner',
			'owner'
		],
		options: [
			'editor',
			'viewer',
			'previewer',
			'uploader',
			'previewer_uploader',
			'viewer_uploader',
			'co-owner',
			'owner'
		]
	}),
	status: flags.string({
		description: 'Update the collaboration status',
		options: [
			'accepted',
			'pending',
			'rejected'
		]
	}),
	editor: flags.boolean({
		description: 'Set the role to editor',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'previewer',
			'uploader',
			'previewer-uploader',
			'viewer-uploader',
			'co-owner',
			'owner'
		]
	}),
	viewer: flags.boolean({
		description: 'Set the role to viewer',
		hidden: true,
		exclusive: [
			'role',
			'editor',
			'previewer',
			'uploader',
			'previewer-uploader',
			'viewer-uploader',
			'co-owner',
			'owner'
		]
	}),
	previewer: flags.boolean({
		description: 'Set the role to previewer',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'editor',
			'uploader',
			'previewer-uploader',
			'viewer-uploader',
			'co-owner',
			'owner'
		]
	}),
	uploader: flags.boolean({
		description: 'Set the role to uploader',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'previewer',
			'editor',
			'previewer-uploader',
			'viewer-uploader',
			'co-owner',
			'owner'
		]
	}),
	'previewer-uploader': flags.boolean({
		description: 'Set the role to previewer-uploader',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'previewer',
			'uploader',
			'editor',
			'viewer-uploader',
			'co-owner',
			'owner'
		]
	}),
	'viewer-uploader': flags.boolean({
		description: 'Set the role to viewer-uploader',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'previewer',
			'uploader',
			'previewer-uploader',
			'editor',
			'co-owner',
			'owner'
		]
	}),
	'co-owner': flags.boolean({
		description: 'Set the role to co-owner',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'previewer',
			'uploader',
			'previewer-uploader',
			'viewer-uploader',
			'editor',
			'owner'
		]
	}),
	owner: flags.boolean({
		description: 'Set the role to owner',
		hidden: true,
		exclusive: [
			'role',
			'viewer',
			'previewer',
			'uploader',
			'previewer-uploader',
			'viewer-uploader',
			'editor',
			'co-owner'
		]
	}),
	'can-view-path': flags.boolean({
		description: 'Whether view path collaboration feature is enabled or not',
		allowNo: true
	}),
	'expires-at': flags.string({
		description: 'When the collaboration should expire',
	})
};

CollaborationsUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the collaboration to update'
	}
];

module.exports = CollaborationsUpdateCommand;
