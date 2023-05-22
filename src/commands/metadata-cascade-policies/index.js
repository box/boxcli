'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const PaginationUtils = require('../../pagination-utils');

class MetadataCascadePoliciesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataCascadePoliciesListCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags['owner-enterprise-id']) {
			options.owner_enterprise_id = flags['owner-enterprise-id'];
		}

		let policies = await this.client.metadata.getCascadePolicies(args.folderID, options);
		await this.output(policies);
	}
}

MetadataCascadePoliciesListCommand.description = 'List the metadata cascade policies on a folder';
MetadataCascadePoliciesListCommand.examples = ['box metadata-cascade-policies 22222'];
MetadataCascadePoliciesListCommand._endpoint = 'get_metadata_cascade_policies';

MetadataCascadePoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	'owner-enterprise-id': flags.string({ description: 'The ID of the enterprise to filter cascade policies for '}),
};

MetadataCascadePoliciesListCommand.args = [
	{
		name: 'folderID',
		required: true,
		hidden: false,
		description: 'The ID of the folder to list cascade policies for',
	}
];

module.exports = MetadataCascadePoliciesListCommand;
