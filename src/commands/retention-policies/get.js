'use strict';

const BoxCommand = require('../../box-command');

class RetentionPoliciesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetCommand);

		let policy = await this.client.retentionPolicies.get(args.id);
		await this.output(policy);
	}
}

RetentionPoliciesGetCommand.description = 'Get information about a retention policy';

RetentionPoliciesGetCommand.flags = {
	...BoxCommand.flags
};

RetentionPoliciesGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the retention policy to get',
	}
];

module.exports = RetentionPoliciesGetCommand;
