'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const PaginationUtils = require('../../pagination-utils');

class RetentionPoliciesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesListCommand);
		let options = PaginationUtils.handlePagination(flags);

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

RetentionPoliciesListCommand.description = 'List all retention policies for your enterprise';
RetentionPoliciesListCommand.examples = ['box retention-policies'];
RetentionPoliciesListCommand._endpoint = 'get_retention_policies';

RetentionPoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	'policy-name': flags.string({
		char: 'n',
		description: 'A name to filter the retention policies by'
	}),
	'policy-type': flags.string({
		description: 'A policy type to filter the retention policies by',
		options: [
			'finite',
			'indefinite'
		]
	}),
	'created-by-user-id': flags.string({
		char: 'u',
		description: 'A user id to filter the retention policies by'
	})
};

module.exports = RetentionPoliciesListCommand;
