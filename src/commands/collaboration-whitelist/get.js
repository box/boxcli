'use strict';

const BoxCommand = require('../../box-command');

class CollaborationWhitelistGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let whitelistEntry = await this.client.collaborationWhitelist.getWhitelistedDomain(args.id, options);
		await this.output(whitelistEntry);
	}
}

CollaborationWhitelistGetCommand.description = 'Get a collaboration whitelist entry';

CollaborationWhitelistGetCommand.flags = {
	...BoxCommand.flags
};

CollaborationWhitelistGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collaboration whitelist entry record to get'
	}
];

module.exports = CollaborationWhitelistGetCommand;
