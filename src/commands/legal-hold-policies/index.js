'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../pagination-utils');

class LegalHoldPoliciesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(LegalHoldPoliciesListCommand);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags['policy-name']) {
			options.policy_name = flags['policy-name'];
		}

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let policies = await this.client.legalHoldPolicies.getAll(options);
		await this.output(policies);
	}
}

LegalHoldPoliciesListCommand.description = 'List legal hold policies';
LegalHoldPoliciesListCommand.examples = ['box legal-hold-policies'];
LegalHoldPoliciesListCommand._endpoint = 'get_legal_hold_policies';

LegalHoldPoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'policy-name': Flags.string({ description: 'Filter by policy name' }),
};

module.exports = LegalHoldPoliciesListCommand;
