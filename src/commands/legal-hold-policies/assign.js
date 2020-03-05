'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class LegalHoldPoliciesAssignCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesAssignCommand);

		let assignType = flags['assign-to-type'];
		let assignID = flags['assign-to-id'];

		let assignment = await this.client.legalHoldPolicies.assign(args.policyID, assignType, assignID);
		await this.output(assignment);
	}
}

LegalHoldPoliciesAssignCommand.description = 'Create a new policy assignment';
LegalHoldPoliciesAssignCommand.examples = ['box legal-hold-policies:assign 99999 --assign-to-type folder --assign-to-id 22222'];

LegalHoldPoliciesAssignCommand.flags = {
	...BoxCommand.flags,
	'assign-to-type': flags.string({
		required: true,
		description: 'Type of object to assign the policy to',
		options: [
			'file_version',
			'file',
			'folder',
			'user'
		],
	}),
	'assign-to-id': flags.string({
		description: 'ID of the object to assign the policy to',
		required: true,
	}),
};

LegalHoldPoliciesAssignCommand.args = [
	{
		name: 'policyID',
		required: true,
		hidden: false,
		description: 'ID of the legal hold policy to assign',
	}
];

module.exports = LegalHoldPoliciesAssignCommand;
