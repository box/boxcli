'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const CollaborationModule = require('../../modules/collaboration');

class CollaborationsAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(CollaborationsAddCommand);

		let collabModule = new CollaborationModule(this.client);
		let collaboration = await collabModule.createCollaboration(args, flags);
		await this.output(collaboration);
	}
}

CollaborationsAddCommand.aliases = ['collaborations:add'];

CollaborationsAddCommand.description = 'Create a collaboration for a Box item';
CollaborationsAddCommand.examples = [
	'box collaborations:create 22222 folder --role editor --user-id 33333',
];
CollaborationsAddCommand._endpoint = 'post_collaborations';

CollaborationsAddCommand.flags = {
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
		],
		options: [
			'editor',
			'viewer',
			'previewer',
			'uploader',
			'previewer_uploader',
			'viewer_uploader',
			'co-owner',
		],
	}),
	'user-id': Flags.string({
		description: 'Id for user to collaborate',
		exclusive: ['group-id', 'login'],
	}),
	'group-id': Flags.string({
		description: 'Id for group to collaborate',
		exclusive: ['user-id', 'login'],
	}),
	login: Flags.string({
		description: 'Login for user to collaborate',
		exclusive: ['group-id', 'user-id'],
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
		],
	}),
	'can-view-path': Flags.boolean({
		description:
			'Whether view path collaboration feature is enabled or not',
		allowNo: true,
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
	notify: Flags.boolean({
		description:
			'All users will receive email notification of the collaboration',
		allowNo: true,
	}),
};

CollaborationsAddCommand.args = {
	itemID: Args.string({
		name: 'itemID',
		required: true,
		hidden: false,
		description: 'The ID of the Box item to add the collaboration to',
	}),
	itemType: Args.string({
		name: 'itemType',
		required: true,
		hidden: false,
		description: 'The type of the Box item to add the collaboration to',
		options: ['file', 'folder'],
	}),
};

module.exports = CollaborationsAddCommand;
