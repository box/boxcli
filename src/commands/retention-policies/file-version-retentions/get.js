'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class RetentionPoliciesGetVersionRetentionCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(RetentionPoliciesGetVersionRetentionCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let retention = await this.client.retentionPolicies.getFileVersionRetention(args.id, options);
		await this.output(retention);
	}
}

RetentionPoliciesGetVersionRetentionCommand.description = 'Get information about a file version retention policy';
RetentionPoliciesGetVersionRetentionCommand.examples = ['box retention-policies:file-version-retentions:get 77777'];
RetentionPoliciesGetVersionRetentionCommand._endpoint = 'get_file_version_retentions_id';

RetentionPoliciesGetVersionRetentionCommand.flags = {
	...BoxCommand.flags
};

RetentionPoliciesGetVersionRetentionCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the file version retention to get',
	}),
};

module.exports = RetentionPoliciesGetVersionRetentionCommand;
