'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class StoragePoliciesAssignCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(StoragePoliciesAssignCommand);

		let assignment = await this.client.storagePolicies.assign(args.storagePolicyID, args.userID);
		await this.output(assignment);
	}
}

StoragePoliciesAssignCommand.description = 'Assign a storage policy';
StoragePoliciesAssignCommand.examples = ['box storage-policies:assign 12345 33333'];

StoragePoliciesAssignCommand.flags = {
	...BoxCommand.flags
};

StoragePoliciesAssignCommand.args = {
	storagePolicyID: Args.string({
		name: 'storagePolicyID',
		required: true,
		hidden: false,
		description: 'Id of the storage policy'
	}),
	userID: Args.string({
		name: 'userID',
		required: true,
		hidden: false,
		description: 'Id of the user to assign the storage policy to'
	}),
};

module.exports = StoragePoliciesAssignCommand;
