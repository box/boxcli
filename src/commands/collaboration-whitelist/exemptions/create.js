'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationWhitelistCreateExemptionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistCreateExemptionCommand);

		let exemptEntry = await this.client.collaborationWhitelist.addExemption(args.userID);
		await this.output(exemptEntry);
	}
}

CollaborationWhitelistCreateExemptionCommand.description = 'Exempt a user from the collaboration whitelist';
CollaborationWhitelistCreateExemptionCommand.examples = [
	'box collaboration-whitelist:exemptions:create 11111'
];
CollaborationWhitelistCreateExemptionCommand._endpoint = 'post_collaboration_whitelist_exempt_targets';

CollaborationWhitelistCreateExemptionCommand.flags = {
	...BoxCommand.flags
};

CollaborationWhitelistCreateExemptionCommand.args = [
	{
		name: 'userID',
		required: true,
		hidden: false,
		description: 'ID of the user to exempt from the collaboration whitelist'
	}
];

module.exports = CollaborationWhitelistCreateExemptionCommand;
