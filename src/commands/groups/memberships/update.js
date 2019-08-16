'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class GroupsUpdateMembershipCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsUpdateMembershipCommand);
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
		if (flags['set-admin']) {
			options.role = this.client.groups.userRoles.ADMIN;
		} else if (flags['set-member']) {
			options.role = this.client.groups.userRoles.MEMBER;
		}
		if (flags.role) {
			options.role = flags.role;
		}

		let membership = await this.client.groups.updateMembership(args.id, options);
		await this.output(membership);
	}
}

GroupsUpdateMembershipCommand.aliases = [ 'groups:membership:update' ];

GroupsUpdateMembershipCommand.description = 'Update a user\'s membership to a group';
GroupsUpdateMembershipCommand.examples = [
	'box groups:memberships:update'
];
GroupsUpdateMembershipCommand._endpoint = 'put_group_memberships_id';

GroupsUpdateMembershipCommand.flags = {
	...BoxCommand.flags,
	role: flags.string({
		char: 'r',
		description: 'Set the user\'s role in the group',
		options: [
			'member',
			'admin'
		],
		exclusive: [
			'set-admin',
			'set-member'
		],
	}),
	'set-admin': flags.boolean({
		description: 'Set the user\'s role to Group Admin',
		exclusive: [
			'set-member',
			'role'
		],
		hidden: true,
	}),
	'set-member': flags.boolean({
		description: 'Set the user\'s role to Group Member',
		exclusive: [
			'set-admin',
			'role'
		],
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

GroupsUpdateMembershipCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group membership to update',
	}
];

module.exports = GroupsUpdateMembershipCommand;
