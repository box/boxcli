'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const PaginationUtils = require('../../../pagination-utils');

class LegalHoldPoliciesListAssignmentsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(LegalHoldPoliciesListAssignmentsCommand);
		let options = PaginationUtils.handlePagination(flags);

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
LegalHoldPoliciesListAssignmentsCommand.examples = ['box legal-hold-policies:assignments 99999'];
LegalHoldPoliciesListAssignmentsCommand._endpoint = 'get_legal_hold_policy_assignments';

LegalHoldPoliciesListAssignmentsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	'assign-to-type': Flags.string({
		description: 'Filter by assignment type',
		options: [
			'file_version',
			'file',
			'folder',
			'user'
		]
	}),
	'assign-to-id': Flags.string({ description: 'Filter by assignment Id' })
};

LegalHoldPoliciesListAssignmentsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the legal hold policy get get assignments for',
	}),
};

module.exports = LegalHoldPoliciesListAssignmentsCommand;
