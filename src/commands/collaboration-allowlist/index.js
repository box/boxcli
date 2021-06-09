'use strict';

const BoxCommand = require('../../box-command');

class CollaborationAllowlistListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationAllowlistListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let allowlistEntries = await this.client.collaborationAllowlist.getAllAllowlistedDomains(options);
		await this.output(allowlistEntries);
	}
}

CollaborationAllowlistListCommand.description = 'List collaboration allowlist entries';
CollaborationAllowlistListCommand.examples = ['box collaboration-allowlist'];
CollaborationAllowlistListCommand._endpoint = 'get_collaboration_whitelist_entries';

CollaborationAllowlistListCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollaborationAllowlistListCommand;
