'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class RetentionPoliciesRemoveAssignmentCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(
			RetentionPoliciesRemoveAssignmentCommand
		);

		await this.client.retentionPolicies.deleteAssignment(args.id);
		this.info(`Removed retention policy assignment ${args.id}`);
	}
}

RetentionPoliciesRemoveAssignmentCommand.description =
	'Remove a retention policy assignment applied to content';
RetentionPoliciesRemoveAssignmentCommand.examples = [
	'box retention-policies:assignments:remove 1235',
];
RetentionPoliciesRemoveAssignmentCommand._endpoint =
	'delete_retention_policy_assignments_id';

RetentionPoliciesRemoveAssignmentCommand.flags = {
	...BoxCommand.flags,
};

RetentionPoliciesRemoveAssignmentCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy assignment to remove',
	}),
};

module.exports = RetentionPoliciesRemoveAssignmentCommand;
