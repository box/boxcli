'use strict';

const BoxCommand = require('../../box-command');

class CollaborationWhitelistDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationWhitelistDeleteCommand);

		await this.client.collaborationWhitelist.removeDomain(args.id);
		this.info(`Deleted collaboration whitelist entry ${args.id}`);
	}
}

CollaborationWhitelistDeleteCommand.description = 'Delete a collaboration whitelist entry';
CollaborationWhitelistDeleteCommand.examples = ['box collaboration-whitelist:delete 12345'];
CollaborationWhitelistDeleteCommand._endpoint = 'delete_collaboration_whitelist_entries_id';

CollaborationWhitelistDeleteCommand.flags = {
	...BoxCommand.flags
};

CollaborationWhitelistDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collaboration whitelist entry record to delete'
	}
];

module.exports = CollaborationWhitelistDeleteCommand;
