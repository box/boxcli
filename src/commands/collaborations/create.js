'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class CollaborationsAddCommand extends BoxCommand {

	async run() {
		const { flags, args } = this.parse(CollaborationsAddCommand);
		let params = {
			body: {
				item: {
					type: args.itemType,
					id: args.itemID,
				},
				accessible_by: {}
			},
			qs: {}
		};

		if (flags.fields) {
			params.qs.fields = flags.fields;
		}
		if (flags.hasOwnProperty('notify')) {
			params.qs.notify = flags.notify;
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
		}

		if (flags['user-id']) {
			params.body.accessible_by.type = 'user';
			params.body.accessible_by.id = flags['user-id'];
		} else if (flags['group-id']) {
			params.body.accessible_by.type = 'group';
			params.body.accessible_by.id = flags['group-id'];
		} else if (flags.login) {
			params.body.accessible_by.type = 'user';
			params.body.accessible_by.login = flags.login;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		let collaboration = await this.client.wrapWithDefaultHandler(this.client.post)('/collaborations', params);
		await this.output(collaboration);
	}
}

CollaborationsAddCommand.hidden = true;

CollaborationsAddCommand.aliases = [ 'collaborations:add' ];

CollaborationsAddCommand.description = 'Create a collaboration for a Box item';

CollaborationsAddCommand.flags = {
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
			'co-owner'
		],
		options: [
			'editor',
			'viewer',
			'previewer',
			'uploader',
			'previewer_uploader',
			'viewer_uploader',
			'co-owner'
		]
	}),
	'user-id': flags.string({
		description: 'Id for user to collaborate',
		exclusive: [
			'group-id',
			'login'
		]
	}),
	'group-id': flags.string({
		description: 'Id for group to collaborate',
		exclusive: [
			'user-id',
			'login'
		]
	}),
	login: flags.string({
		description: 'Login for user to collaborate',
		exclusive: [
			'group-id',
			'user-id'
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
		]
	}),
	'can-view-path': flags.boolean({
		description: 'Whether view path collaboration feature is enabled or not',
		allowNo: true
	}),
	'id-only': flags.boolean({ description: 'Return only an ID to output from this command' }),
	notify: flags.boolean({
		description: 'All users will receive email notification of the collaboration',
		allowNo: true,
	})
};

CollaborationsAddCommand.args = [
	{
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'The ID of the Box item to add the collaboration to',
	},
	{
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'The type of the Box item to add the collaboration to',
		options: [
			'file',
			'folder'
		]
	}
];

module.exports = CollaborationsAddCommand;
