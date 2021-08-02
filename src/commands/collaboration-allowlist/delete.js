'use strict';

const BoxCommand = require('../../box-command');

class CollaborationAllowlistDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationAllowlistDeleteCommand);

		await this.client.collaborationAllowlist.removeDomain(args.id);
		this.info(`Deleted collaboration allowlist entry ${args.id}`);
	}
}

CollaborationAllowlistDeleteCommand.description = 'Delete a collaboration allowlist entry';
CollaborationAllowlistDeleteCommand.examples = ['box collaboration-allowlist:delete 12345'];
CollaborationAllowlistDeleteCommand._endpoint = 'delete_collaboration_whitelist_entries_id';

CollaborationAllowlistDeleteCommand.flags = {
	...BoxCommand.flags
};

CollaborationAllowlistDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collaboration allowlist entry record to delete'
	}
];

module.exports = CollaborationAllowlistDeleteCommand;
