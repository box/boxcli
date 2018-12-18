'use strict';

const BoxCommand = require('../../../box-command');

class RetentionPoliciesGetVersionRetentionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesGetVersionRetentionCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let retention = await this.client.retentionPolicies.getFileVersionRetention(args.id, options);
		await this.output(retention);
	}
}

RetentionPoliciesGetVersionRetentionCommand.description = 'Get information about a file version retention policy';

RetentionPoliciesGetVersionRetentionCommand.flags = {
	...BoxCommand.flags
};

RetentionPoliciesGetVersionRetentionCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file version retention to get',
	}
];

module.exports = RetentionPoliciesGetVersionRetentionCommand;
