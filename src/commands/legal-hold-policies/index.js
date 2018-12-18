'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class LegalHoldPoliciesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesListCommand);
		let options = {};

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

LegalHoldPoliciesListCommand.flags = {
	...BoxCommand.flags,
	'policy-name': flags.string({ description: 'Filter by policy name' })
};

module.exports = LegalHoldPoliciesListCommand;
