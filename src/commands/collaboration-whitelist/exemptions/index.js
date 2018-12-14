'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationWhitelistListExemptUserCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistListExemptUserCommand);

		let exemptions = await this.client.collaborationWhitelist.getAllExemptions();
		await this.output(exemptions);
	}
}

CollaborationWhitelistListExemptUserCommand.description = 'List collaboration whitelist exemptions';

CollaborationWhitelistListExemptUserCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollaborationWhitelistListExemptUserCommand;
