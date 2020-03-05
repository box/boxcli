'use strict';

const BoxCommand = require('../../../box-command');

class StoragePoliciesDeleteAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(StoragePoliciesDeleteAssignmentCommand);

		await this.client.storagePolicies.removeAssignment(args.id);
		this.info(`Deleted storage policy assignment ${args.id}`);
	}
}

StoragePoliciesDeleteAssignmentCommand.description = 'Delete a storage policy assignment';
StoragePoliciesDeleteAssignmentCommand.examples = ['box storage-policies:assignments:remove 12345'];
StoragePoliciesDeleteAssignmentCommand._endpoint = 'delete_storage_policy_assignments_id';

StoragePoliciesDeleteAssignmentCommand.flags = {
	...BoxCommand.flags
};

StoragePoliciesDeleteAssignmentCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the storage policy assignment to delete',
	}
];

module.exports = StoragePoliciesDeleteAssignmentCommand;
