'use strict';

const BoxCommand = require('../../box-command');

class StoragePoliciesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(StoragePoliciesGetCommand);

		let storagePolicy = await this.client.storagePolicies.get(args.id);
		await this.output(storagePolicy);
	}
}

StoragePoliciesGetCommand.description = 'Get information on a storage policy';

StoragePoliciesGetCommand.flags = {
	...BoxCommand.flags
};

StoragePoliciesGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the storage policy to get',
	}
];

module.exports = StoragePoliciesGetCommand;
