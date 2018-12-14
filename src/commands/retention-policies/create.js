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

		let policy = await this.client.retentionPolicies.create(args.policyName, policyType, dispositionAction, options);
		await this.output(policy);
	}
}

RetentionPoliciesCreateCommand.description = 'Create a new retention policy';

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
