'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class CollaborationAllowlistDeleteExemptionCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(
			CollaborationAllowlistDeleteExemptionCommand
		);

		await this.client.collaborationAllowlist.removeExemption(args.id);
		this.info(`Deleted collaboration allowlist exemption ${args.id}`);
	}
}

CollaborationAllowlistDeleteExemptionCommand.description =
	'Delete a collaboration allowlist exemption';
CollaborationAllowlistDeleteExemptionCommand.examples = [
	'box collaboration-allowlist:exemptions:delete 12345',
];
CollaborationAllowlistDeleteExemptionCommand._endpoint =
	'delete_collaboration_whitelist_exempt_targets_id';

CollaborationAllowlistDeleteExemptionCommand.flags = {
	...BoxCommand.flags,
};

CollaborationAllowlistDeleteExemptionCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the allowlist exemption record to delete',
	}),
};

module.exports = CollaborationAllowlistDeleteExemptionCommand;
