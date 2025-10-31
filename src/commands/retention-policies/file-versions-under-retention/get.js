'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtils = require('../../../pagination-utils');

class RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand
		);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let fileVersions =
			await this.client.retentionPolicies.getFileVersionsUnderRetentionForAssignment(
				args.id,
				options
			);
		await this.output(fileVersions);
	}
}

RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.description =
	'Get information about file versions under retention for assignment';
RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.examples = [
	'box retention-policies:file-versions-under-retention:get 77777',
];
RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand._endpoint =
	'get_retention_policy_assignments_id_file_versions_under_retention';
RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy assignment',
	}),
};

module.exports = RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand;
