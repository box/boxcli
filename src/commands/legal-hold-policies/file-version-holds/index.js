'use strict';

const BoxCommand = require('../../../box-command');

class LegalHoldPoliciesListVersionHoldsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesListVersionHoldsCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let fileVersionHolds = await this.client.legalHoldPolicies.getAllFileVersionLegalHolds(args.id, options);
		await this.output(fileVersionHolds);
	}
}

LegalHoldPoliciesListVersionHoldsCommand.description = 'List file version legal holds for a legal hold policy';

LegalHoldPoliciesListVersionHoldsCommand.flags = {
	...BoxCommand.flags
};

LegalHoldPoliciesListVersionHoldsCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the legal hold policy to get holds for',
	}
];

module.exports = LegalHoldPoliciesListVersionHoldsCommand;
