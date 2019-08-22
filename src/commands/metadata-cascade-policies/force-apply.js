'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const chalk = require('chalk');

class MetadataCascadePoliciesForceApplyCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataCascadePoliciesForceApplyCommand);

		await this.client.metadata.forceApplyCascadePolicy(args.id, flags['conflict-resolution']);
		this.info(chalk`{green Successfully applied policy ${args.id}}`);
	}
}

MetadataCascadePoliciesForceApplyCommand.description = 'Force apply a cascade policy to the existing items in a folder';
MetadataCascadePoliciesForceApplyCommand.examples = ['box metadata-cascade-policies:force-apply 12345 --conflict-resolution overwrite'];
MetadataCascadePoliciesForceApplyCommand._endpoint = 'post_metadata_cascade_policies_apply';

MetadataCascadePoliciesForceApplyCommand.flags = {
	...BoxCommand.flags,
	'conflict-resolution': flags.string({
		description: 'The way to resolve conflicts with the metadata being applied',
		required: true,
		options: [
			'none',
			'overwrite'
		],
	}),
};

MetadataCascadePoliciesForceApplyCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the cascade policy to force apply',
	}
];

module.exports = MetadataCascadePoliciesForceApplyCommand;
