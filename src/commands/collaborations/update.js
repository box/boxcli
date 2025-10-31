'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const chalk = require('chalk');

class CollaborationsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(CollaborationsUpdateCommand);
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
			params.body.role =
				this.client.collaborationRoles.PREVIEWER_UPLOADER;
		} else if (flags['viewer-uploader']) {
			params.body.role = this.client.collaborationRoles.VIEWER_UPLOADER;
		} else if (flags['co-owner']) {
			params.body.role = this.client.collaborationRoles.CO_OWNER;
		} else if (flags.owner) {
			params.body.role = this.client.collaborationRoles.OWNER;
		}
		if (flags['expires-at']) {
			params.body.expires_at = flags['expires-at'];
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		let collaboration = await this.client.wrapWithDefaultHandler(
			this.client.put
		)(`/collaborations/${args.id}`, params);
		if (collaboration) {
			await this.output(collaboration);
		} else if (params.body.role === this.client.collaborationRoles.OWNER) {
			// Upgrading a collaborator to owner produces a 204 response with empty body
			// Output a success message instead of trying to print the updated collaboration
			this.info(
				chalk`{green Collaborator successfully upgraded to owner.}`
			);
		}
	}
}

CollaborationsUpdateCommand.aliases = [
	'files:collaborations:update',
	'folders:collaborations:update',
];

CollaborationsUpdateCommand.description = 'Update a collaboration';
CollaborationsUpdateCommand.examples = [
	'box collaborations:update 12345 --role viewer',
];
CollaborationsUpdateCommand._endpoint = 'put_collaborations_id';

CollaborationsUpdateCommand.flags = {
	...BoxCommand.flags,
	role: Flags.string({
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
			'owner',
		],
		options: [
			'editor',
			'viewer',
			'previewer',
			'uploader',
			'previewer_uploader',
			'viewer_uploader',
			'co-owner',
			'owner',
		],
	}),
	status: Flags.string({
		description: 'Update the collaboration status',
		options: ['accepted', 'pending', 'rejected'],
	}),
	editor: Flags.boolean({
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
			'owner',
		],
	}),
	viewer: Flags.boolean({
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
			'owner',
		],
	}),
	previewer: Flags.boolean({
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
			'owner',
		],
	}),
	uploader: Flags.boolean({
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
			'owner',
		],
	}),
	'previewer-uploader': Flags.boolean({
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
			'owner',
		],
	}),
	'viewer-uploader': Flags.boolean({
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
			'owner',
		],
	}),
	'co-owner': Flags.boolean({
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
			'owner',
		],
	}),
	owner: Flags.boolean({
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
			'co-owner',
		],
	}),
	'can-view-path': Flags.boolean({
		description:
			'Whether view path collaboration feature is enabled or not',
		allowNo: true,
	}),
	'expires-at': Flags.string({
		description: 'When the collaboration should expire',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
};

CollaborationsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the collaboration to update',
	}),
};

module.exports = CollaborationsUpdateCommand;
