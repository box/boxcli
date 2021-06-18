'use strict';

const BoxCommand = require('../../../box-command');

class CollaborationAllowlistGetExemptionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationAllowlistGetExemptionCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let exemption = await this.client.collaborationAllowlist.getExemption(args.id, options);
		await this.output(exemption);
	}
}

CollaborationAllowlistGetExemptionCommand.description = 'Get a collaboration allowlist exemption';
CollaborationAllowlistGetExemptionCommand.examples = ['box collaboration-allowlist:exemptions:get 12345'];
CollaborationAllowlistGetExemptionCommand._endpoint = 'get_collaboration_whitelist_exempt_targets_id';

CollaborationAllowlistGetExemptionCommand.flags = {
	...BoxCommand.flags
};

CollaborationAllowlistGetExemptionCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the allowlist exemption record to get'
	}
];

module.exports = CollaborationAllowlistGetExemptionCommand;
