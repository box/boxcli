'use strict';

const BoxCommand = require('../../box-command');
const BoxCLIError = require('../../cli-error');
const { flags } = require('@oclif/command');

class RetentionPoliciesAssignCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesAssignCommand);
		let assignment;

		let assignType = flags['assign-to-type'];
		let assignID = flags['assign-to-id'];
		let options = {};

		if (flags.hasOwnProperty('filter-fields')) {
			options.filter_fields = flags['filter-fields'];
		}
		if (flags.hasOwnProperty('start-date-field')) {
			options.start_date_field = flags['start-date-field'];
		}

		if (assignType === 'enterprise') {
			assignment = await this.client.retentionPolicies.assign(args.policyID, assignType, null, options);
		} else {
			if (!assignID) {
				throw new BoxCLIError('An ID of the content to assign the retention policy to is required');
			}
			assignment = await this.client.retentionPolicies.assign(args.policyID, assignType, assignID, options);
		}
		await this.output(assignment);
	}
}

RetentionPoliciesAssignCommand.description = 'Assign a retention policy assignment';
RetentionPoliciesAssignCommand.examples = ['box retention-policies:assign 12345 --assign-to-type folder --assign-to-id 22222'];
RetentionPoliciesAssignCommand._endpoint = 'post_retention_policy_assignments';

RetentionPoliciesAssignCommand.flags = {
	...BoxCommand.flags,
	'assign-to-type': flags.string({
		description: 'The type of the content to assign the retention policy to',
		required: true,
		options: [
			'enterprise',
			'folder',
			'metadata_template'
		],
	}),
	'assign-to-id': flags.string({
		description: 'The ID of the content to assign the retention policy to',
	}),
	'filter-fields': flags.string({
		description: ' Metadata fields to filter against, if assigning to a metadata template.' +
			'Allow properties: field, value. Example: field=foo,value=bar',
		multiple: true,
		parse(input) {
			const filter = {};
			input.split(',').forEach((pair) => {
				const [key, value] = pair.split('=');
				switch (key) {
					case 'field':
						filter.field = value;
						break;
					case 'value':
						filter.value = value;
						break;
					default:
							throw new BoxCLIError(`Unknown property for signer: ${key}`);
				}
			});
			return filter;
		}
	}),
	'start-date-field': flags.string({
		description: 'The date the retention policy assignment begins',
	}),
};

RetentionPoliciesAssignCommand.args = [
	{
		name: 'policyID',
		required: true,
		hidden: false,
		description: 'The ID of the retention policy to assign this content to',
	}
];

module.exports = RetentionPoliciesAssignCommand;
