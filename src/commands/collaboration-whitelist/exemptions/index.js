'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationWhitelistListExemptUserCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistListExemptUserCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let exemptions = await this.client.collaborationWhitelist.getAllExemptions(options);
		await this.output(exemptions);
	}
}

CollaborationWhitelistListExemptUserCommand.description = 'List collaboration whitelist exemptions';

CollaborationWhitelistListExemptUserCommand.flags = {
	...BoxCommand.flags
};

module.exports = CollaborationWhitelistListExemptUserCommand;
