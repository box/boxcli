'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../pagination-utils');

class RetentionPoliciesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(RetentionPoliciesListCommand);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags['policy-name']) {
			options.policy_name = flags['policy-name'];
		}
		if (flags['policy-type']) {
			options.policy_type = flags['policy-type'];
		}
		if (flags['created-by-user-id']) {
			options.created_by_user_id = flags['created-by-user-id'];
		}

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let policies = await this.client.retentionPolicies.getAll(options);
		await this.output(policies);
	}
}

RetentionPoliciesListCommand.description =
	'List all retention policies for your enterprise';
RetentionPoliciesListCommand.examples = ['box retention-policies'];
RetentionPoliciesListCommand._endpoint = 'get_retention_policies';

RetentionPoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'policy-name': Flags.string({
		char: 'n',
		description: 'A name to filter the retention policies by',
	}),
	'policy-type': Flags.string({
		description: 'A policy type to filter the retention policies by',
		options: ['finite', 'indefinite'],
	}),
	'created-by-user-id': Flags.string({
		char: 'u',
		description: 'A user id to filter the retention policies by',
	}),
};

module.exports = RetentionPoliciesListCommand;
