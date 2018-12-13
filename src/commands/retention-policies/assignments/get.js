'use strict';

const BoxCommand = require('../../../box-command');

class RetentionPoliciesGetAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetAssignmentCommand);

		let assignment = await this.client.retentionPolicies.getAssignment(args.id);
		await this.output(assignment);
	}
}

RetentionPoliciesGetAssignmentCommand.description = 'Get information about a retention policy assignment';

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
