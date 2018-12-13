'use strict';

const BoxCommand = require('../../box-command');

class MetadataCascadePoliciesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataCascadePoliciesGetCommand);

		let policy = await this.client.metadata.getCascadePolicy(args.id);
		await this.output(policy);
	}
}

MetadataCascadePoliciesGetCommand.description = 'Get information about a metadata cascade policy';

MetadataCascadePoliciesGetCommand.flags = {
	...BoxCommand.flags
};

MetadataCascadePoliciesGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'The ID of the cascade policy to get',
	}
];

module.exports = MetadataCascadePoliciesGetCommand;
