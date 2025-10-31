'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtils = require('../../../pagination-utils');

class CollaborationAllowlistListExemptUserCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			CollaborationAllowlistListExemptUserCommand
		);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let exemptions =
			await this.client.collaborationAllowlist.getAllExemptions(options);
		await this.output(exemptions);
	}
}

CollaborationAllowlistListExemptUserCommand.description =
	'List collaboration allowlist exemptions';
CollaborationAllowlistListExemptUserCommand.examples = [
	'box collaboration-allowlist:exemptions',
];
CollaborationAllowlistListExemptUserCommand._endpoint =
	'get_collaboration_whitelist_exempt_targets';

CollaborationAllowlistListExemptUserCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

module.exports = CollaborationAllowlistListExemptUserCommand;
