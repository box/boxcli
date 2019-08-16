'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class LegalHoldPoliciesListAssignmentsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesListAssignmentsCommand);
		let options = {};

		if (flags['assign-to-type']) {
			options.assign_to_type = flags['assign-to-type'];
		}
		if (flags['assign-to-id']) {
			options.assign_to_id = flags['assign-to-id'];
		}

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let assignments = await this.client.legalHoldPolicies.getAssignments(args.id, options);
		await this.output(assignments);
	}
}

LegalHoldPoliciesListAssignmentsCommand.description = 'List policy assignments';
LegalHoldPoliciesListAssignmentsCommand.examples = [
	'box legal-hold-policies:assignments 99999'
];
LegalHoldPoliciesListAssignmentsCommand._endpoint = 'get_legal_hold_policy_assignments';

LegalHoldPoliciesListAssignmentsCommand.flags = {
	...BoxCommand.flags,
	'assign-to-type': flags.string({
		description: 'Filter by assignment type',
		options: [
			'file_version',
			'file',
			'folder',
			'user'
		]
	}),
	'assign-to-id': flags.string({ description: 'Filter by assignment Id' })
};

LegalHoldPoliciesListAssignmentsCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the legal hold policy get get assignments for',
	}
];

module.exports = LegalHoldPoliciesListAssignmentsCommand;
