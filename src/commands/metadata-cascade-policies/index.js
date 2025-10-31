'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const PaginationUtilities = require('../../pagination-utils');

class MetadataCascadePoliciesListCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			MetadataCascadePoliciesListCommand
		);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags['owner-enterprise-id']) {
			options.owner_enterprise_id = flags['owner-enterprise-id'];
		}

		let policies = await this.client.metadata.getCascadePolicies(
			args.folderID,
			options
		);
		await this.output(policies);
	}
}

MetadataCascadePoliciesListCommand.description =
	'List the metadata cascade policies on a folder';
MetadataCascadePoliciesListCommand.examples = [
	'box metadata-cascade-policies 22222',
];
MetadataCascadePoliciesListCommand._endpoint = 'get_metadata_cascade_policies';

MetadataCascadePoliciesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'owner-enterprise-id': Flags.string({
		description: 'The ID of the enterprise to filter cascade policies for ',
	}),
};

MetadataCascadePoliciesListCommand.args = {
	folderID: Args.string({
		name: 'folderID',
		required: true,
		hidden: false,
		description: 'The ID of the folder to list cascade policies for',
	}),
};

module.exports = MetadataCascadePoliciesListCommand;
