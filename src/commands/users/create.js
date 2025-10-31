'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const BoxCLIError = require('../../cli-error');

class UsersCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(UsersCreateCommand);
		let options = {};
		let user;

		if (flags.hasOwnProperty('sync-enable')) {
			options.is_sync_enabled = flags['sync-enable'];
		}
		if (flags['password-reset']) {
			options.is_password_reset_required = true;
		}
		if (flags.hasOwnProperty('exempt-from-device-limits')) {
			options.is_exempt_from_device_limits =
				flags['exempt-from-device-limits'];
		}
		if (flags.hasOwnProperty('exempt-from-2fa')) {
			options.is_exempt_from_login_verification =
				flags['exempt-from-2fa'];
		}
		if (flags.hasOwnProperty('restrict-external-collab')) {
			options.is_external_collab_restricted =
				flags['restrict-external-collab'];
		}
		if (flags.hasOwnProperty('can-see-managed-users')) {
			options.can_see_managed_users = flags['can-see-managed-users'];
		}
		if (flags.role) {
			options.role = flags.role;
		}
		if (flags.language) {
			options.language = flags.language;
		}
		if (flags['job-title']) {
			options.job_title = flags['job-title'];
		}
		if (flags['phone-number']) {
			options.phone = flags['phone-number'];
		}
		if (flags.address) {
			options.address = flags.address;
		}
		if (flags['disk-space']) {
			options.space_amount = parseInt(flags['disk-space'], 10);
		}
		if (flags.status) {
			options.status = flags.status;
		}
		if (flags.timezone) {
			options.timezone = flags.timezone;
		}
		if (flags['external-id']) {
			options.external_app_user_id = flags['external-id'];
		}
		if (flags['tracking-codes']) {
			options.tracking_codes = flags['tracking-codes'];
		}

		if (flags['app-user']) {
			user = await this.client.enterprise.addAppUser(args.name, options);
		} else if (args.login) {
			user = await this.client.enterprise.addUser(
				args.login,
				args.name,
				options
			);
		} else {
			throw new BoxCLIError(
				'Either the login argument or the --app-user flag is required'
			);
		}
		await this.output(user);
	}
}

UsersCreateCommand.description = 'Create a new Box User';
UsersCreateCommand.examples = ['box users:create "John Doe" jdoe@example.com'];
UsersCreateCommand._endpoint = 'post_users';

UsersCreateCommand.flags = {
	...BoxCommand.flags,
	'app-user': Flags.boolean({
		description: 'Set this user as an app user',
	}),
	'external-id': Flags.string({
		description: 'External ID for app users',
		dependsOn: ['app-user'],
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
	'sync-enable': Flags.boolean({
		description: 'Enable Box Sync for this user',
		exclusive: ['sync-disable'],
		allowNo: true,
	}),
	'exempt-from-device-limits': Flags.boolean({
		description: 'Exempt user from device limits',
		allowNo: true,
	}),
	'exempt-from-2fa': Flags.boolean({
		description: 'Exempt user from two-factor auth',
		allowNo: true,
	}),
	'restrict-external-collab': Flags.boolean({
		description: 'Restrict user from external collaboration',
		allowNo: true,
	}),
	'can-see-managed-users': Flags.boolean({
		description: 'User can see managed users',
		allowNo: true,
	}),
	'password-reset': Flags.boolean({
		description: 'Force the user to reset password',
	}),
	role: Flags.string({
		char: 'r',
		description: 'Role of user. Enter user or coadmin',
		options: ['user', 'coadmin'],
	}),
	language: Flags.string({
		char: 'l',
		description:
			'Language of the user (ISO 639-1 Language Code). https://developer.box.com/v2.0/docs/api-language-codes',
	}),
	'job-title': Flags.string({
		char: 'j',
		description: 'Job title of the user',
	}),
	'phone-number': Flags.string({
		char: 'p',
		description: 'Phone number of the user',
	}),
	address: Flags.string({
		char: 'a',
		description: 'Address of the user',
	}),
	'disk-space': Flags.string({
		char: 'd',
		description:
			"User's available storage in bytes. Value of -1 grants unlimited storage",
	}),
	status: Flags.string({
		char: 'S',
		description: 'User status',
		options: [
			'active',
			'inactive',
			'cannot_delete_edit',
			'cannot_delete_edit_upload',
		],
	}),
	timezone: Flags.string({
		description:
			"The user's timezone. Input format follows tz database timezones",
	}),
	'tracking-codes': Flags.string({
		description:
			'Comma-separated list of key-value pairs to associate with the user. Format is name=value,name=value',
		parse: (input) =>
			input.split(',').map((pair) => {
				const [name, value] = pair.split('=');
				return {
					type: 'tracking_code',
					name,
					value,
				};
			}),
	}),
};

UsersCreateCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: "The user's name",
	}),
	login: Args.string({
		name: 'login',
		required: false,
		hidden: false,
		description:
			"The user's email address, not required when creating app users",
	}),
};

module.exports = UsersCreateCommand;
