'use strict';

const BoxCommand = require('../../box-command');
const chalk = require('chalk');

class MetadataCascadePoliciesDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataCascadePoliciesDeleteCommand);

		await this.client.metadata.deleteCascadePolicy(args.id);
		this.info(chalk`{green Successfully deleted policy ${args.id}}`);
	}
}

MetadataCascadePoliciesDeleteCommand.description = 'Delete a metadata cascade policy';
MetadataCascadePoliciesDeleteCommand.examples = [
	'box metadata-cascade-policies:delete 12345'
];
MetadataCascadePoliciesDeleteCommand._endpoint = 'delete_metadata_cascade_policies_id';

MetadataCascadePoliciesDeleteCommand.flags = {
	...BoxCommand.flags
};

MetadataCascadePoliciesDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the metadata cascade policy to delete',
	}
];

module.exports = MetadataCascadePoliciesDeleteCommand;
