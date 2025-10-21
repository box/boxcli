'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class UsersUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersUpdateCommand);
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
			updates.is_exempt_from_login_verification = flags['exempt-from-2fa'];
		}
		if (flags.hasOwnProperty('restrict-external-collab')) {
			updates.is_external_collab_restricted = flags['restrict-external-collab'];
		}
		if (flags.hasOwnProperty('can-see-managed-users')) {
			updates.can_see_managed_users = flags['can-see-managed-users'];
		}
		if (flags.hasOwnProperty('notification-email')) {
			if (flags['notification-email'] === '') {
				updates.notification_email = null;
			} else {
				updates.notification_email = { email: flags['notification-email'] };
			}
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
		if (flags.remove) {
			updates.enterprise = null;
		}
		if (flags.login) {
			updates.login = flags.login;
		}
		if (flags.name) {
			updates.name = flags.name;
		}
		if (flags['external-id']) {
			updates.external_app_user_id = flags['external-id'];
		}
		if (flags['tracking-codes']) {
			updates.tracking_codes = flags['tracking-codes'];
		}

		let user = await this.client.users.update(args.id, updates);
		await this.output(user);
	}
}

UsersUpdateCommand.description = 'Update a Box User';
UsersUpdateCommand.examples = ['box users:update 33333 --status inactive'];
UsersUpdateCommand._endpoint = 'put_users_id';

UsersUpdateCommand.flags = {
	...BoxCommand.flags,
	remove: Flags.boolean({
		description: 'Remove the user from the enterprise, convert to free account'
	}),
	name: Flags.string({
		char: 'n',
		description: 'Set the user\'s name',
	}),
	'sync-enable': Flags.boolean({
		description: 'Enable Box Sync for this user',
		allowNo: true,
	}),
	'exempt-from-device-limits': Flags.boolean({
		description: 'Exempt user from device limits',
		allowNo: true
	}),
	'exempt-from-2fa': Flags.boolean({
		description: 'Exempt user from two-factor auth',
		allowNo: true
	}),
	'restrict-external-collab': Flags.boolean({
		description: 'Restrict user from external collaboration',
		allowNo: true
	}),
	'can-see-managed-users': Flags.boolean({
		description: 'User can see managed users',
		allowNo: true
	}),
	'password-reset': Flags.boolean({
		description: 'Force the user to reset password'
	}),
	role: Flags.string({
		char: 'r',
		description: 'Role of user. Enter user or coadmin',
		options: [
			'user',
			'coadmin'
		]
	}),
	language: Flags.string({
		char: 'l',
		description: 'Language of the user (ISO 639-1 Language Code). https://developer.box.com/v2.0/docs/api-language-codes'
	}),
	'job-title': Flags.string({
		char: 'j',
		description: 'Job title of the user'
	}),
	'phone-number': Flags.string({
		char: 'p',
		description: 'Phone number of the user'
	}),
	address: Flags.string({
		char: 'a',
		description: 'Address of the user'
	}),
	'disk-space': Flags.string({
		char: 'd',
		description: 'User\'s available storage in bytes. Value of -1 grants unlimited storage'
	}),
	status: Flags.string({
		char: 'S',
		description: 'User status. Enter active, inactive, cannot_delete_edit, or cannot_delete_edit_upload',
		options: [
			'active',
			'inactive',
			'cannot_delete_edit',
			'cannot_delete_edit_upload'
		]
	}),
	timezone: Flags.string({ description: 'The user\'s timezone. Input format follows tz database timezones' }),
	login: Flags.string({ description: 'Change the user\'s primary email address used for logging into Box '}),
	'external-id': Flags.string({
		description: 'External ID for app users',
	}),
	'tracking-codes': Flags.string({
		description: 'Comma-separated list of key-value pairs to associate with the user. Format is name=value,name=value',
		parse: input => input.split(',').map(pair => {
			const [name, value] = pair.split('=');
			return {
				type: 'tracking_code',
				name,
				value
			};
		}),
	}),
	'notification-email': Flags.string({
		description: 'Notification email address for the user, set to empty string to remove',
	}),
};

UsersUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'User ID to update',
	}),
};

module.exports = UsersUpdateCommand;
