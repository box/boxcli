'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class MetadataCascadePoliciesCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataCascadePoliciesCreateCommand);

		let policy = await this.client.metadata.createCascadePolicy(flags.scope, args.templateKey, flags.folder);
		await this.output(policy);
	}
}

MetadataCascadePoliciesCreateCommand.description = 'Create a new metadata cascade policy on a folder';
MetadataCascadePoliciesCreateCommand.examples = ['box metadata-templates:cascade employeeRecord --folder 22222'];
MetadataCascadePoliciesCreateCommand._endpoint = 'post_metadata_cascade_policies';
MetadataCascadePoliciesCreateCommand.aliases = ['metadata-cascade-policies:create']

MetadataCascadePoliciesCreateCommand.flags = {
	...BoxCommand.flags,
	'id-only': flags.boolean({
		description: 'Return only an ID to output from this command'
	}),
	scope: flags.string({
		description: 'The scope of the metadata template to cascade',
		default: 'enterprise',
	}),
	folder: flags.string({
		required: true,
		description: 'The ID of the folder to cascade metadata on',
	})
};

MetadataCascadePoliciesCreateCommand.args = [
	{
		name: 'templateKey',
		required: true,
		hidden: false,
		description: 'The template key of the metadata template to cascade'
	}
];

module.exports = MetadataCascadePoliciesCreateCommand;
