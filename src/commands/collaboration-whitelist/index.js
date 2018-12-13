'use strict';

const BoxCommand = require('../../box-command');

class CollaborationWhitelistListCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(CollaborationWhitelistListCommand);
		const { args } = this.parse(CollaborationWhitelistListCommand);

		let whitelistEntries = await this.client.collaborationWhitelist.getAllWhitelistedDomains();
		await this.output(whitelistEntries);
	}
}

CollaborationWhitelistListCommand.description = 'List collaboration whitelist entries';

CollaborationWhitelistListCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollaborationWhitelistListCommand;
