'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class StoragePoliciesGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(StoragePoliciesGetCommand);

		let storagePolicy = await this.client.storagePolicies.get(args.id);
		await this.output(storagePolicy);
	}
}

StoragePoliciesGetCommand.description = 'Get information on a storage policy';
StoragePoliciesGetCommand.examples = ['box storage-policies:get 12345'];
StoragePoliciesGetCommand._endpoint = 'get_storage_policies_id';

StoragePoliciesGetCommand.flags = {
	...BoxCommand.flags,
};

StoragePoliciesGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the storage policy to get',
	}),
};

module.exports = StoragePoliciesGetCommand;
