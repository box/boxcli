'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtilities = require('../../pagination-utils');

class CollaborationAllowlistListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(CollaborationAllowlistListCommand);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let allowlistEntries =
			await this.client.collaborationAllowlist.getAllAllowlistedDomains(
				options
			);
		await this.output(allowlistEntries);
	}
}

CollaborationAllowlistListCommand.description =
	'List collaboration allowlist entries';
CollaborationAllowlistListCommand.examples = ['box collaboration-allowlist'];
CollaborationAllowlistListCommand._endpoint =
	'get_collaboration_whitelist_entries';

CollaborationAllowlistListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

module.exports = CollaborationAllowlistListCommand;
