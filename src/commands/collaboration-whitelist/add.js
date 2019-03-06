'use strict';

const { flags } = require('@oclif/command');
const BoxCommand = require('../../box-command');

class CollaborationWhitelistAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistAddCommand);

		let whitelistEntry = await this.client.collaborationWhitelist.addDomain(args.domain, flags.direction);
		await this.output(whitelistEntry);
	}
}

CollaborationWhitelistAddCommand.description = 'Add a collaboration whitelist entry';

CollaborationWhitelistAddCommand.flags = {
	...BoxCommand.flags,
	direction: flags.string({
		description: 'Direction to whitelist collaboration in',
		options: [
			'inbound',
			'outbound',
			'both'
		],
		required: true,
	})
};

CollaborationWhitelistAddCommand.args = [
	{
		name: 'domain',
		required: true,
		hidden: false,
		description: 'Domain to add to whitelist (e.g. box.com)'
	}
];

module.exports = CollaborationWhitelistAddCommand;
