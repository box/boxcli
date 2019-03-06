'use strict';

const BoxCommand = require('../../box-command');

class RetentionPoliciesGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let policy = await this.client.retentionPolicies.get(args.id, options);
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
