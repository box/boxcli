'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class UsersUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(UsersUpdateCommand);
		let updates = {};

		if (flags.hasOwnProperty('sync-enable')) {
			updates.is_sync_enabled = flags['sync-enable'];
		}
		if (flags['password-reset']) {
			updates.is_password_reset_required = true;
		}
		if (flags.hasOwnProperty('exempt-from-device-limits')) {
			updates.is_exempt_from_device_limits = flags['exempt-from-device-limits'];
		}
		if (flags.hasOwnProperty('exempt-from-2fa')) {
			updates.is_exempt_login_verification = flags['exempt-from-2fa'];
		}
		if (flags.hasOwnProperty('restrict-external-collab')) {
			updates.is_external_collab_restricted = flags['restrict-external-collab'];
		}
		if (flags.hasOwnProperty('can-see-managed-users')) {
			updates.can_see_managed_users = flags['can-see-managed-users'];
		}
		if (flags.role) {
			updates.role = flags.role;
		}
		if (flags.language) {
			updates.language = flags.language;
		}
		if (flags['job-title']) {
			updates.job_title = flags['job-title'];
		}
		if (flags['phone-number']) {
			updates.phone = flags['phone-number'];
		}
		if (flags.address) {
			updates.address = flags.address;
		}
		if (flags['disk-space']) {
			updates.space_amount = parseInt(flags['disk-space'], 10);
		}
		if (flags.status) {
			updates.status = flags.status;
		}
		if (flags.timezone) {
			updates.timezone = flags.timezone;
		}
		if (flags['avatar-url']) {
			updates.avatar_url = flags['avatar-url'];
		}
		if (flags.remove) {
			updates.enterprise = null;
		}
		if (flags.login) {
			updates.login = flags.login;
		}
		if (flags.name) {
			updates.name = flags.name;
		}

		let user = await this.client.users.update(args.id, updates);
		await this.output(user);
	}
}

UsersUpdateCommand.description = 'Update a Box User';

UsersUpdateCommand.flags = {
	...BoxCommand.flags,
	remove: flags.boolean({
		description: 'Remove the user from the enterprise, convert to free account'
	}),
	name: flags.string({
		char: 'n',
		description: 'Set the user\'s name',
	}),
	'sync-enable': flags.boolean({
		description: 'Enable Box Sync for this user',
		allowNo: true,
	}),
	'exempt-from-device-limits': flags.boolean({
		description: 'Exempt user from device limits',
		allowNo: true
	}),
	'exempt-from-2fa': flags.boolean({
		description: 'Exempt user from two-factor auth',
		allowNo: true
	}),
	'restrict-external-collab': flags.boolean({
		description: 'Restrict user from external collaboration',
		allowNo: true
	}),
	'can-see-managed-users': flags.boolean({
		description: 'User can see managed users',
		allowNo: true
	}),
	'password-reset': flags.boolean({
		description: 'Force the user to reset password'
	}),
	role: flags.string({
		char: 'r',
		description: 'Role of user. Enter user or coadmin',
		options: [
			'user',
			'coadmin'
		]
	}),
	language: flags.string({
		char: 'l',
		description: 'Language of the user (ISO 639-1 Language Code). https://developer.box.com/v2.0/docs/api-language-codes'
	}),
	'job-title': flags.string({
		char: 'j',
		description: 'Job title of the user'
	}),
	'phone-number': flags.string({
		char: 'p',
		description: 'Phone number of the user'
	}),
	address: flags.string({
		char: 'a',
		description: 'Address of the user'
	}),
	'disk-space': flags.string({
		char: 'd',
		description: 'User\'s available storage in bytes. Value of -1 grants unlimited storage'
	}),
	status: flags.string({
		char: 'S',
		description: 'User status. Enter active, inactive, cannot_delete_edit, or cannot_delete_edit_upload',
		options: [
			'active',
			'inactive',
			'cannot_delete_edit',
			'cannot_delete_edit_upload'
		]
	}),
	timezone: flags.string({ description: 'The user\'s timezone. Input format follows tz database timezones' }),
	'avatar-url': flags.string({ description: 'URL of the user\'s avatar image' }),
	login: flags.string({ description: 'Change the user\'s primary email address used for logging into Box '}),
};

UsersUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'User ID to update',
	}
];

module.exports = UsersUpdateCommand;
