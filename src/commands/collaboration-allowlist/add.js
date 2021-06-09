'use strict';

const { flags } = require('@oclif/command');
const BoxCommand = require('../../box-command');

class CollaborationAllowlistAddCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationAllowlistAddCommand);

		let allowlistEntry = await this.client.collaborationAllowlist.addDomain(args.domain, flags.direction);
		await this.output(allowlistEntry);
	}
}

CollaborationAllowlistAddCommand.description = 'Add a collaboration allowlist entry';
CollaborationAllowlistAddCommand.examples = ['box collaboration-allowlist:add example.com --direction outbound'];
CollaborationAllowlistAddCommand._endpoint = 'post_collaboration_whitelist_entries';

CollaborationAllowlistAddCommand.flags = {
	...BoxCommand.flags,
	direction: flags.string({
		description: 'Direction to allowlist collaboration in',
		options: [
			'inbound',
			'outbound',
			'both'
		],
		required: true,
	})
};

CollaborationAllowlistAddCommand.args = [
	{
		name: 'domain',
		required: true,
		hidden: false,
		description: 'Domain to add to allowlist (e.g. box.com)'
	}
];

module.exports = CollaborationAllowlistAddCommand;
