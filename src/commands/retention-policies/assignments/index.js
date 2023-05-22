'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');
const PaginationUtils = require('../../../pagination-utils');

class RetentionPoliciesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesListCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.type) {
			options.type = flags.type;
		}

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let assignments = await this.client.retentionPolicies.getAssignments(args.id, options);
		await this.output(assignments);
	}
}

RetentionPoliciesListCommand.description = 'List all retention policies for your enterprise';
RetentionPoliciesListCommand.examples = ['box retention-policies:assignments 12345'];
RetentionPoliciesListCommand._endpoint = 'get_retention_policies_id_assignments';

RetentionPoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	type: flags.string({
		description: 'The type of the retention policy assignment to retrieve',
		options: [
			'folder',
			'enterprise',
			'metadata_template'
		],
	})
};

RetentionPoliciesListCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy to get assignments for',
	}
];

module.exports = RetentionPoliciesListCommand;
