'use strict';

const BoxCommand = require('../../../box-command');

class RetentionPoliciesGetFilesRetentionForAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetFilesRetentionForAssignmentCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let files = await this.client.retentionPolicies.getFilesUnderRetentionForAssignment(args.id, options);
		await this.output(files);
	}
}

RetentionPoliciesGetFilesRetentionForAssignmentCommand.description = 'Get information about files under retention for assignment';
RetentionPoliciesGetFilesRetentionForAssignmentCommand.examples = ['box retention-policies:files-under-retention:get 77777'];
RetentionPoliciesGetFilesRetentionForAssignmentCommand._endpoint = 'get_retention_policy_assignments_id_files_under_retention';

RetentionPoliciesGetFilesRetentionForAssignmentCommand.flags = {
	...BoxCommand.flags
};

RetentionPoliciesGetFilesRetentionForAssignmentCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy assignment',
	}
];

module.exports = RetentionPoliciesGetFilesRetentionForAssignmentCommand;
