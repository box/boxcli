'use strict';

const BoxCommand = require('../../../box-command');
const { flags } = require('@oclif/command');

class RetentionPoliciesListVersionRetentionCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RetentionPoliciesListVersionRetentionCommand);
		let options = {};

		if (flags['disposition-action']) {
			options.disposition_action = flags['disposition-action'];
		}
		if (flags['disposition-after']) {
			options.disposition_after = this.getDateFromString(flags['disposition-after']);
		}
		if (flags['disposition-before']) {
			options.disposition_before = this.getDateFromString(flags['disposition-before']);
		}
		if (flags['file-id']) {
			options.file_id = flags['file-id'];
		}
		if (flags['file-version-id']) {
			options.file_version_id = flags['file-version-id'];
		}
		if (flags['policy-id']) {
			options.policy_id = flags['policy-id'];
		}

		let retentions = await this.client.retentionPolicies.getAllFileVersionRetentions(options);
		await this.output(retentions);
	}
}

RetentionPoliciesListVersionRetentionCommand.description = 'List all file version retentions for your enterprise';

RetentionPoliciesListVersionRetentionCommand.flags = {
	...BoxCommand.flags,
	'disposition-action': flags.string({
		description: 'A disposition action to filter by',
		options: [
			'permanently_delete',
			'remove_retention'
		]
	}),
	'disposition-after': flags.string({ description: 'A date to filter retention policies that complete after a certain time' }),
	'disposition-before': flags.string({ description: 'A date to filter retention policies that complete before a certain time' }),
	'file-id': flags.string({ description: 'A file id to filter the file version retentions by' }),
	'file-version-id': flags.string({ description: 'A file version id to filter the file version retentions by' }),
	'policy-id': flags.string({ description: 'A policy id to filter the file version retentions by' })
};

module.exports = RetentionPoliciesListVersionRetentionCommand;
