'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationWhitelistDeleteExemptionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistDeleteExemptionCommand);

		await this.client.collaborationWhitelist.removeExemption(args.id);
		this.info(`Deleted collaboration whitelist exemption ${args.id}`);
	}
}

CollaborationWhitelistDeleteExemptionCommand.description = 'Delete a collaboration whitelist exemption';

CollaborationWhitelistDeleteExemptionCommand.flags = {
	...BoxCommand.flags
};

CollaborationWhitelistDeleteExemptionCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the whitelist exemption record to delete'
	}
];

module.exports = CollaborationWhitelistDeleteExemptionCommand;
