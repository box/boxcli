'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class CollaborationAllowlistCreateExemptionCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(CollaborationAllowlistCreateExemptionCommand);

		let exemptEntry = await this.client.collaborationAllowlist.addExemption(args.userID);
		await this.output(exemptEntry);
	}
}

CollaborationAllowlistCreateExemptionCommand.description = 'Exempt a user from the collaboration allowlist';
CollaborationAllowlistCreateExemptionCommand.examples = ['box collaboration-allowlist:exemptions:create 11111'];
CollaborationAllowlistCreateExemptionCommand._endpoint = 'post_collaboration_whitelist_exempt_targets';

CollaborationAllowlistCreateExemptionCommand.flags = {
	...BoxCommand.flags
};

CollaborationAllowlistCreateExemptionCommand.args = {
	userID: Args.string({
		name: 'userID',
		required: true,
		hidden: false,
		description: 'ID of the user to exempt from the collaboration allowlist'
	})
};

module.exports = CollaborationAllowlistCreateExemptionCommand;
