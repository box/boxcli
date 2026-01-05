'use strict';

const BoxCommand = require('../../box-command');
const BoxCLIError = require('../../cli-error');
const { Flags, Args } = require('@oclif/core');

class RetentionPoliciesAssignCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			RetentionPoliciesAssignCommand
		);
		let assignment;

		let assignType = flags['assign-to-type'];
		let assignID = flags['assign-to-id'];
		let options = {};

		if (Object.hasOwn(flags, 'filter-field')) {
			options.filter_fields = flags['filter-field'];
		}
		if (Object.hasOwn(flags, 'start-date-field')) {
			options.start_date_field = flags['start-date-field'];
		}

		if (assignType === 'enterprise') {
			assignment = await this.client.retentionPolicies.assign(
				args.policyID,
				assignType,
				null,
				options
			);
		} else {
			if (!assignID) {
				throw new BoxCLIError(
					'An ID of the content to assign the retention policy to is required'
				);
			}
			assignment = await this.client.retentionPolicies.assign(
				args.policyID,
				assignType,
				assignID,
				options
			);
		}
		await this.output(assignment);
	}
}

RetentionPoliciesAssignCommand.description =
	'Assign a retention policy assignment';
RetentionPoliciesAssignCommand.examples = [
	'box retention-policies:assign 12345 --assign-to-type folder --assign-to-id 22222 --filter-field=fieldName=fieldValue --start-date-field=upload_date',
];
RetentionPoliciesAssignCommand._endpoint = 'post_retention_policy_assignments';

RetentionPoliciesAssignCommand.flags = {
	...BoxCommand.flags,
	'assign-to-type': Flags.string({
		description:
			'The type of the content to assign the retention policy to',
		required: true,
		options: ['enterprise', 'folder', 'metadata_template'],
	}),
	'assign-to-id': Flags.string({
		description: 'The ID of the content to assign the retention policy to',
	}),
	'filter-field': Flags.string({
		description:
			'Metadata fields to filter against, if assigning to a metadata template.' +
			'Allow properties: field, value. Example: --filter-field=fieldName=fieldValue',
		multiple: true,
		parse(input) {
			const filter = {};
			input = input.split('=');
			if (input.length !== 2) {
				throw new BoxCLIError('Invalid filter field');
			}
			filter.field = input[0];
			filter.value = input[1];
			return filter;
		},
	}),
	'start-date-field': Flags.string({
		description: 'The date the retention policy assignment begins',
	}),
};

RetentionPoliciesAssignCommand.args = {
	policyID: Args.string({
		name: 'policyID',
		required: true,
		hidden: false,
		description: 'The ID of the retention policy to assign this content to',
	}),
};

module.exports = RetentionPoliciesAssignCommand;
