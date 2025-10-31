'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtilities = require('../../pagination-utils');

class StoragePoliciesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(StoragePoliciesListCommand);
		let options = PaginationUtilities.handlePagination(flags);

		let storagePolicies = await this.client.storagePolicies.getAll(options);
		await this.output(storagePolicies);
	}
}

StoragePoliciesListCommand.aliases = ['storage-policies:list'];

StoragePoliciesListCommand.description = 'List storage policies';
StoragePoliciesListCommand.examples = ['box storage-policies'];
StoragePoliciesListCommand._endpoint = 'get_storage_policies';

StoragePoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

module.exports = StoragePoliciesListCommand;
