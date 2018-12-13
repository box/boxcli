'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationWhitelistGetExemptionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistGetExemptionCommand);

		let exemption = await this.client.collaborationWhitelist.getExemption(args.id);
		await this.output(exemption);
	}
}

CollaborationWhitelistGetExemptionCommand.description = 'Get a collaboration whitelist exemption';

CollaborationWhitelistGetExemptionCommand.flags = {
	...BoxCommand.flags
};

CollaborationWhitelistGetExemptionCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the whitelist exemption record to get'
	}
];

module.exports = CollaborationWhitelistGetExemptionCommand;
