'use strict';

const BoxCommand = require('../../../box-command');

class RetentionPoliciesGetAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetAssignmentCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let assignment = await this.client.retentionPolicies.getAssignment(args.id, options);
		await this.output(assignment);
	}
}

RetentionPoliciesGetAssignmentCommand.description = 'Get information about a retention policy assignment';
RetentionPoliciesGetAssignmentCommand.examples = [
	'box retention-policies:assignments:get 1235'
];
RetentionPoliciesGetAssignmentCommand._endpoint = 'get_retention_policy_assignments_id';

RetentionPoliciesGetAssignmentCommand.flags = {
	...BoxCommand.flags
};

RetentionPoliciesGetAssignmentCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy assignment to get',
	}
];

module.exports = RetentionPoliciesGetAssignmentCommand;
