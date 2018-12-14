'use strict';

const BoxCommand = require('../../../box-command');

class LegalHoldPoliciesDeleteAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesDeleteAssignmentCommand);

		await this.client.legalHoldPolicies.deleteAssignment(args.id);
		this.info(`Delete policy assignment ${args.id}`);
	}
}

LegalHoldPoliciesDeleteAssignmentCommand.description = 'Delete a policy assignment';

LegalHoldPoliciesDeleteAssignmentCommand.flags = {
	...BoxCommand.flags
};

LegalHoldPoliciesDeleteAssignmentCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the policy assignment to delete',
	}
];

module.exports = LegalHoldPoliciesDeleteAssignmentCommand;
