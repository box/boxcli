'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class CollaborationAllowlistGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			CollaborationAllowlistGetCommand
		);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let allowlistEntry =
			await this.client.collaborationAllowlist.getAllowlistedDomain(
				args.id,
				options
			);
		await this.output(allowlistEntry);
	}
}

CollaborationAllowlistGetCommand.description =
	'Get a collaboration allowlist entry';
CollaborationAllowlistGetCommand.examples = [
	'box collaboration-allowlist:get 12345',
];
CollaborationAllowlistGetCommand._endpoint =
	'get_collaboration_whitelist_entries_id';

CollaborationAllowlistGetCommand.flags = {
	...BoxCommand.flags,
};

CollaborationAllowlistGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the collaboration allowlist entry record to get',
	}),
};

module.exports = CollaborationAllowlistGetCommand;
