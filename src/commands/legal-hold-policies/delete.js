'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class LegalHoldPoliciesDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(LegalHoldPoliciesDeleteCommand);

		await this.client.legalHoldPolicies.delete(args.id);
		this.info(`Deleted legal hold policy ${args.id}`);
	}
}

LegalHoldPoliciesDeleteCommand.description = 'Delete a legal hold policy';
LegalHoldPoliciesDeleteCommand.examples = [
	'box legal-hold-policies:delete 99999',
];
LegalHoldPoliciesDeleteCommand._endpoint = 'delete_legal_hold_policies_id';

LegalHoldPoliciesDeleteCommand.flags = {
	...BoxCommand.flags,
};

LegalHoldPoliciesDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the legal hold policy to delete',
	}),
};

module.exports = LegalHoldPoliciesDeleteCommand;
