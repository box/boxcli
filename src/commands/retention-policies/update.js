'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class RetentionPoliciesUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			RetentionPoliciesUpdateCommand
		);
		let updates = {};

		if (flags['disposition-action']) {
			updates.disposition_action = flags['disposition-action'];
		}
		if (flags['policy-name']) {
			updates.policy_name = flags['policy-name'];
		}
		if (flags['policy-type']) {
			updates.policy_type = flags['policy-type'];
		}
		if (flags['retention-length']) {
			updates.retention_length = Number.parseInt(
				flags['retention-length'],
				10
			);
		}
		if (flags['non-modifiable']) {
			updates.retention_type =
				this.client.retentionPolicies.retentionTypes.NON_MODIFIABLE;
		}
		if (flags.retire) {
			updates.status = 'retired';
		}

		if (Object.hasOwn(flags, 'notify-owners')) {
			updates.are_owners_notified = flags['notify-owners'];
		}
		if (Object.hasOwn(flags, 'allow-extension')) {
			updates.can_owner_extend_retention = flags['allow-extension'];
		}

		let policy = await this.client.retentionPolicies.update(
			args.id,
			updates
		);
		await this.output(policy);
	}
}

RetentionPoliciesUpdateCommand.description = 'Update a retention policy';
RetentionPoliciesUpdateCommand.examples = [
	'box retention-policies:update 12345',
];
RetentionPoliciesUpdateCommand._endpoint = 'put_retention_policies_id';

RetentionPoliciesUpdateCommand.flags = {
	...BoxCommand.flags,
	'disposition-action': Flags.string({
		char: 'a',
		description:
			'For indefinite policies, disposition action must be remove_retention',
	}),
	'policy-name': Flags.string({
		char: 'n',
		description: 'New name of retention policy',
	}),
	'policy-type': Flags.string({
		description: 'Type of policy',
		options: ['finite', 'indefinite'],
	}),
	'retention-length': Flags.string({
		char: 'l',
		description:
			'The amount of time, in days, to apply the retention policy. Required for finite policies',
	}),
	'non-modifiable': Flags.boolean({
		description: 'Set retention type to non_modifiable. ',
	}),
	retire: Flags.boolean({
		char: 'r',
		description: 'Retire a retention policy',
	}),
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
};

RetentionPoliciesUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy to update',
	}),
};

module.exports = RetentionPoliciesUpdateCommand;
