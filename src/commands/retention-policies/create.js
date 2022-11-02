'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class RetentionPoliciesCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesCreateCommand);

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
			options.retention_type = this.client.retentionPolicies.retentionTypes.MODIFIABLE;
		} else if (flags['non-modifiable']) {
			options.retention_type = this.client.retentionPolicies.retentionTypes.NON_MODIFIABLE;
		}

		let policy = await this.client.retentionPolicies.create(args.policyName, policyType, dispositionAction, options);
		await this.output(policy);
	}
}

RetentionPoliciesCreateCommand.description = 'Create a new retention policy';
RetentionPoliciesCreateCommand.examples = ['box retention-policies:create "Tax Documents" --retention-length 2555 --retention-type "non_modifiable" --disposition-action permanently_delete'];
RetentionPoliciesCreateCommand._endpoint = 'post_retention_policies';

RetentionPoliciesCreateCommand.flags = {
	...BoxCommand.flags,
	'notify-owners': flags.boolean({
		description: 'The owner or co-owner will get notified when a file is nearing expiration',
		allowNo: true
	}),
	'allow-extension': flags.boolean({
		description: 'The owner of a file will be allowed to extend the retention',
		allowNo: true
	}),
	'retention-length': flags.integer({
		char: 'l',
		description: 'The number of days to apply the retention policy. If not set, policy will be indefinite',
	}),
	'retention-type': flags.string({
		description: 'The type of retention for the new policy',
		exclusive: [
			'modifiable',
			'non-modifiable'
		],
		options: [
			'modifiable',
			'non_modifiable'
		]
	}),
	modifiable: flags.boolean({
		description: 'Set retention type to modifiable',
		hidden: true,
		exclusive: [
			'retention-type',
			'non-modifiable',
		]
	}),
	'non-modifiable': flags.boolean({
		description: 'Set retention type to non_modifiable',
		hidden: true,
		exclusive: [
			'retention-type',
			'modifiable',
		]
	}),
	'disposition-action': flags.string({
		required: true,
		description: 'For indefinite policies, disposition action must be remove_retention',
		options: [
			'permanently_delete',
			'remove_retention'
		]
	}),
};

RetentionPoliciesCreateCommand.args = [
	{
		name: 'policyName',
		required: true,
		hidden: false,
		description: 'Name of retention policy to be created'
	}
];

module.exports = RetentionPoliciesCreateCommand;
