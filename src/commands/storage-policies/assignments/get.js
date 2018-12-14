'use strict';

const BoxCommand = require('../../../box-command');

class StoragePoliciesGetAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(StoragePoliciesGetAssignmentCommand);

		let assignment = await this.client.storagePolicies.getAssignment(args.id);
		await this.output(assignment);
	}
}

StoragePoliciesGetAssignmentCommand.description = 'Get information on a storage policy assignment';

StoragePoliciesGetAssignmentCommand.flags = {
	...BoxCommand.flags
};

StoragePoliciesGetAssignmentCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the storage policy assignment to get',
	}
];

module.exports = StoragePoliciesGetAssignmentCommand;
