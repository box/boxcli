'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtils = require('../../../pagination-utils');

class LegalHoldPoliciesListVersionHoldsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(LegalHoldPoliciesListVersionHoldsCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let fileVersionHolds = await this.client.legalHoldPolicies.getAllFileVersionLegalHolds(args.id, options);
		await this.output(fileVersionHolds);
	}
}

LegalHoldPoliciesListVersionHoldsCommand.description = 'List file version legal holds for a legal hold policy';
LegalHoldPoliciesListVersionHoldsCommand.examples = ['box legal-hold-policies:file-version-holds 99999'];
LegalHoldPoliciesListVersionHoldsCommand._endpoint = 'get_file_version_legal_holds';

LegalHoldPoliciesListVersionHoldsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
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
