'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class StoragePoliciesGetAssignmentCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(StoragePoliciesGetAssignmentCommand);

		let assignment = await this.client.storagePolicies.getAssignment(args.id);
		await this.output(assignment);
	}
}

StoragePoliciesGetAssignmentCommand.description = 'Get information on a storage policy assignment';
StoragePoliciesGetAssignmentCommand.examples = ['box storage-policies:assignments:get 12345'];
StoragePoliciesGetAssignmentCommand._endpoint = 'get_storage_policy_assignments_id';

StoragePoliciesGetAssignmentCommand.flags = {
	...BoxCommand.flags
};

StoragePoliciesGetAssignmentCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the storage policy assignment to get',
	}),
};

module.exports = StoragePoliciesGetAssignmentCommand;
