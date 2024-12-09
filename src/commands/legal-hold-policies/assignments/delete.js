'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class LegalHoldPoliciesDeleteAssignmentCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(LegalHoldPoliciesDeleteAssignmentCommand);

		await this.client.legalHoldPolicies.deleteAssignment(args.id);
		this.info(`Delete policy assignment ${args.id}`);
	}
}

LegalHoldPoliciesDeleteAssignmentCommand.description = 'Delete a policy assignment';
LegalHoldPoliciesDeleteAssignmentCommand.examples = ['box legal-hold-policies:assignments:delete 99999'];
LegalHoldPoliciesDeleteAssignmentCommand._endpoint = 'delete_legal_hold_policy_assignments_id';

LegalHoldPoliciesDeleteAssignmentCommand.flags = {
	...BoxCommand.flags
};

LegalHoldPoliciesDeleteAssignmentCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the policy assignment to delete',
	}),
};

module.exports = LegalHoldPoliciesDeleteAssignmentCommand;
