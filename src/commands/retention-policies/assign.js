'use strict';

const BoxCommand = require('../../box-command');
const BoxCLIError = require('../../cli-error');
const { flags } = require('@oclif/command');

class RetentionPoliciesAssignCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesAssignCommand);
		let assignment;

		let assignType = flags['assign-to-type'];
		let assignID = flags['assign-to-id'];

		if (assignType === 'enterprise') {
			assignment = await this.client.retentionPolicies.assign(args.policyID, assignType);
		} else {
			if (!assignID) {
				throw new BoxCLIError('An ID of the content to assign the retention policy to is required');
			}
			assignment = await this.client.retentionPolicies.assign(args.policyID, assignType, assignID);
		}
		await this.output(assignment);
	}
}

RetentionPoliciesAssignCommand.description = 'Assign a retention policy assignment';
RetentionPoliciesAssignCommand.examples = [
	'box retention-policies:assign 12345 --assign-to-type folder --assign-to-id 22222'
];
RetentionPoliciesAssignCommand._endpoint = 'post_retention_policy_assignments';

RetentionPoliciesAssignCommand.flags = {
	...BoxCommand.flags,
	'assign-to-type': flags.string({
		description: 'The type of the content to assign the retention policy to',
		required: true,
		options: [
			'enterprise',
			'folder',
			'metadata_template'
		],
	}),
	'assign-to-id': flags.string({
		description: 'The ID of the content to assign the retention policy to',
	}),
};

RetentionPoliciesAssignCommand.args = [
	{
		name: 'policyID',
		required: true,
		hidden: false,
		description: 'The ID of the retention policy to assign this content to',
	}
];

module.exports = RetentionPoliciesAssignCommand;
