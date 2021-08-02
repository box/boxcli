'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationAllowlistListExemptUserCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationAllowlistListExemptUserCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let exemptions = await this.client.collaborationAllowlist.getAllExemptions(options);
		await this.output(exemptions);
	}
}

CollaborationAllowlistListExemptUserCommand.description = 'List collaboration allowlist exemptions';
CollaborationAllowlistListExemptUserCommand.examples = ['box collaboration-allowlist:exemptions'];
CollaborationAllowlistListExemptUserCommand._endpoint = 'get_collaboration_whitelist_exempt_targets';

CollaborationAllowlistListExemptUserCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollaborationAllowlistListExemptUserCommand;
