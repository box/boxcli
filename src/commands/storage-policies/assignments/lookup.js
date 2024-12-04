'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');

class StoragePoliciesListAssignmentsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(StoragePoliciesListAssignmentsCommand);

		let options = {
			targetType: flags.type
		};

		let assignment = await this.client.storagePolicies.getAssignmentForTarget(args.id, options);
		await this.output(assignment);
	}
}

StoragePoliciesListAssignmentsCommand.description = 'Look up which storage policy an object is assigned to';
StoragePoliciesListAssignmentsCommand.examples = ['box storage-policies:assignments:lookup 33333'];
StoragePoliciesListAssignmentsCommand._endpoint = 'get_storage_policy_assignments';

StoragePoliciesListAssignmentsCommand.flags = {
	...BoxCommand.flags,
	type: Flags.string({
		required: true,
		description: 'Type of object to look up the storage policy for',
		options: [
			'user',
			'enterprise'
		],
		default: 'user',
	})
};

StoragePoliciesListAssignmentsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the object to look up the storage policy for',
	}),
};

module.exports = StoragePoliciesListAssignmentsCommand;
