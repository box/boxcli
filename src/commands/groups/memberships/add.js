'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class GroupsAddMembershipCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsAddMembershipCommand);
		let options = { configurable_permissions: {} };

		if (flags.hasOwnProperty('can-run-reports')) {
			options.configurable_permissions.can_run_reports = flags['can-run-reports'];
		}
		if (flags.hasOwnProperty('can-instant-login')) {
			options.configurable_permissions.can_instant_login = flags['can-instant-login'];
		}
		if (flags.hasOwnProperty('can-create-accounts')) {
			options.configurable_permissions.can_create_accounts = flags['can-create-accounts'];
		}
		if (flags.hasOwnProperty('can-edit-accounts')) {
			options.configurable_permissions.can_edit_accounts = flags['can-edit-accounts'];
		}

		// Set role from the "role" flag first, since it has a default value
		options.role = flags.role;

		if (flags['set-admin']) {
			options.role = this.client.groups.userRoles.ADMIN;
		} else if (flags['set-member']) {
			options.role = this.client.groups.userRoles.MEMBER;
		}

		let membership = await this.client.groups.addUser(args.groupID, args.userID, options);
		await this.output(membership);
	}
}

GroupsAddMembershipCommand.aliases = [ 'groups:membership:add' ];

GroupsAddMembershipCommand.description = 'Add a user to a group';
GroupsAddMembershipCommand.examples = ['box groups:memberships:add 33333 12345'];
GroupsAddMembershipCommand._endpoint = 'post_group_memberships';

GroupsAddMembershipCommand.flags = {
	...BoxCommand.flags,
	role: flags.string({
		char: 'r',
		description: 'Set the user\'s role in the group',
		default: 'member',
		options: [
			'member',
			'admin'
		]
	}),
	'set-admin': flags.boolean({
		description: 'Set the user\'s role to Group Admin',
		exclusive: ['set-member'],
		hidden: true,
	}),
	'set-member': flags.boolean({
		description: 'Set the user\'s role to Group Member',
		exclusive: ['set-admin'],
		hidden: true,
	}),
	'can-run-reports': flags.boolean({
		description: 'If the user is a group admin, allow them to run reports',
		allowNo: true,
	}),
	'can-instant-login': flags.boolean({
		description: 'If the user is a group admin, allow them to instant login',
		allowNo: true,
	}),
	'can-create-accounts': flags.boolean({
		description: 'If the user is a group admin, allow them to create new users',
		allowNo: true,
	}),
	'can-edit-accounts': flags.boolean({
		description: 'If the user is a group admin, allow them to edit user accounts',
		allowNo: true,
	}),
};

GroupsAddMembershipCommand.args = [
	{
		name: 'userID',
		required: true,
		hidden: false,
		description: 'ID of the user to add to the group',
	},
	{
		name: 'groupID',
		required: true,
		hidden: false,
		description: 'ID of the group to add the user to',
	}
];

module.exports = GroupsAddMembershipCommand;
