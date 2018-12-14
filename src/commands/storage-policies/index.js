'use strict';

const BoxCommand = require('../../box-command');

class StoragePoliciesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(StoragePoliciesListCommand);

		let storagePolicies = await this.client.storagePolicies.getAll();
		await this.output(storagePolicies);
	}
}

StoragePoliciesListCommand.aliases = [ 'storage-policies:list' ];

StoragePoliciesListCommand.description = 'List storage policies';

StoragePoliciesListCommand.flags = {
	...BoxCommand.flags
};

module.exports = StoragePoliciesListCommand;
