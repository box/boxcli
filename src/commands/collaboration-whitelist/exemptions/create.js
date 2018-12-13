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
