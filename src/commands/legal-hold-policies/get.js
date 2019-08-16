'use strict';

const BoxCommand = require('../../box-command');

class LegalHoldPoliciesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let policy = await this.client.legalHoldPolicies.get(args.id, options);
		await this.output(policy);
	}
}

LegalHoldPoliciesGetCommand.description = 'Get information about a legal hold policy';
LegalHoldPoliciesGetCommand.examples = ['box legal-hold-policies:get 99999'];
LegalHoldPoliciesGetCommand._endpoint = 'get_legal_hold_policies_id';

LegalHoldPoliciesGetCommand.flags = {
	...BoxCommand.flags
};

LegalHoldPoliciesGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the legal hold policy to get',
	}
];

module.exports = LegalHoldPoliciesGetCommand;
