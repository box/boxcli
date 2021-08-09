'use strict';

const BoxCommand = require('../../../box-command');

class RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let fileVersions = await this.client.retentionPolicies.getFileVersionsUnderRetentionForAssignment(args.id, options);
		await this.output(fileVersions);
	}
}

RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.description = 'Get information about file versions under retention for assignment';
RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.examples = ['box retention-policies:file-versions-under-retention:get 77777'];
RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand._endpoint = 'get_retention_policy_assignments_id_file_versions_under_retention';
RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.flags = {
	...BoxCommand.flags
};

RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy assignment',
	}
];

module.exports = RetentionPoliciesGetFileVersionsRetentionForAssignmentCommand;
