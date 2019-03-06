'use strict';

const BoxCommand = require('../../box-command');

class CollaborationWhitelistListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let whitelistEntries = await this.client.collaborationWhitelist.getAllWhitelistedDomains(options);
		await this.output(whitelistEntries);
	}
}

CollaborationWhitelistListCommand.description = 'List collaboration whitelist entries';

CollaborationWhitelistListCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollaborationWhitelistListCommand;
