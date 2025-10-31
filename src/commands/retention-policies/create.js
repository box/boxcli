'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../util');

class RetentionPoliciesCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			RetentionPoliciesCreateCommand
		);

		let policyType = 'indefinite';
		let dispositionAction = flags['disposition-action'];
		let options = {};

		if (flags.hasOwnProperty('notify-owners')) {
			options.are_owners_notified = flags['notify-owners'];
		}
		if (flags.hasOwnProperty('allow-extension')) {
			options.can_owner_extend_retention = flags['allow-extension'];
		}
		if (flags['retention-length']) {
			policyType = 'finite';
			options.retention_length = flags['retention-length'];
		}
		if (flags['retention-type']) {
			options.retention_type = flags['retention-type'];
		} else if (flags.modifiable) {
			options.retention_type =
				this.client.retentionPolicies.retentionTypes.MODIFIABLE;
		} else if (flags['non-modifiable']) {
			options.retention_type =
				this.client.retentionPolicies.retentionTypes.NON_MODIFIABLE;
		}
		if (flags.hasOwnProperty('description')) {
			options.description = flags.description;
		}
		if (flags.hasOwnProperty('custom-notification-recipient')) {
			options.custom_notification_recipients =
				flags['custom-notification-recipient'];
		}

		let policy = await this.client.retentionPolicies.create(
			args.policyName,
			policyType,
			dispositionAction,
			options
		);
		await this.output(policy);
	}
}

RetentionPoliciesCreateCommand.description = 'Create a new retention policy';
RetentionPoliciesCreateCommand.examples = [
	'box retention-policies:create "Tax Documents" --retention-length 2555 --disposition-action=remove_retention --notify-owners --allow-extension --description "Tax documents for 2018" --custom-notification-recipient=id=12345,login=user@box.com',
];
RetentionPoliciesCreateCommand._endpoint = 'post_retention_policies';

RetentionPoliciesCreateCommand.flags = {
	...BoxCommand.flags,
	'notify-owners': Flags.boolean({
		description:
			'The owner or co-owner will get notified when a file is nearing expiration',
		allowNo: true,
	}),
	'allow-extension': Flags.boolean({
		description:
			'The owner of a file will be allowed to extend the retention',
		allowNo: true,
	}),
	'retention-length': Flags.integer({
		char: 'l',
		description:
			'The number of days to apply the retention policy. If not set, policy will be indefinite',
	}),
	'retention-type': Flags.string({
		description: 'The type of retention for the new policy',
		exclusive: ['modifiable', 'non-modifiable'],
		options: ['modifiable', 'non_modifiable'],
	}),
	modifiable: Flags.boolean({
		description: 'Set retention type to modifiable',
		hidden: true,
		exclusive: ['retention-type', 'non-modifiable'],
	}),
	'non-modifiable': Flags.boolean({
		description: 'Set retention type to non_modifiable',
		hidden: true,
		exclusive: ['retention-type', 'modifiable'],
	}),
	'disposition-action': Flags.string({
		required: true,
		description:
			'For indefinite policies, disposition action must be remove_retention',
		options: ['permanently_delete', 'remove_retention'],
	}),
	description: Flags.string({
		required: false,
		description: 'The additional text description of the retention policy',
		parse: utils.unescapeSlashes,
	}),
	'custom-notification-recipient': Flags.string({
		description:
			'A list of users notified when the retention policy duration is about to end. ' +
			'Allowed properties are: id, type, login, name',
		multiple: true,
		parse(input) {
			const user = {
				type: 'user',
			};

			for (const part of input.split(',')) {
				const [key, value] = part.split('=');
				user[key] = value;
			}
			return user;
		},
	}),
};

RetentionPoliciesCreateCommand.args = {
	policyName: Args.string({
		name: 'policyName',
		required: true,
		hidden: false,
		description: 'Name of retention policy to be created',
	}),
};

module.exports = RetentionPoliciesCreateCommand;
