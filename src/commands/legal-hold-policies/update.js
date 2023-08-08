'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../util');

class LegalHoldPoliciesUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesUpdateCommand);
		let updates = {};

		if (flags.description) {
			updates.description = flags.description;
		}
		if (flags['policy-name']) {
			updates.policy_name = flags['policy-name'];
		}
		if (flags['release-notes']) {
			updates.release_notes = flags['release-notes'];
		}

		let policy = await this.client.legalHoldPolicies.update(args.id, updates);
		await this.output(policy);
	}
}

LegalHoldPoliciesUpdateCommand.description = 'Update a legal hold policy';
LegalHoldPoliciesUpdateCommand.examples = ['box legal-hold-policies:update 99999 --description "Files related to the ongoing class action suit"'];
LegalHoldPoliciesUpdateCommand._endpoint = 'put_legal_hold_policies_id';

LegalHoldPoliciesUpdateCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({ description: 'Description of legal hold policy. Max characters 500', parse: utils.unescapeSlashes }),
	'policy-name': flags.string({ description: 'Name of legal hold policy. Max characters 254' }),
	'release-notes': flags.string({ description: 'Notes around why the policy was released. Max characters 500' })
};

LegalHoldPoliciesUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of a legal hold policy to update',
	}
];

module.exports = LegalHoldPoliciesUpdateCommand;
