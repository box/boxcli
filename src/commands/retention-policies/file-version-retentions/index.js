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
			options.disposition_after = flags['disposition-after'];
		}
		if (flags['disposition-before']) {
			options.disposition_before = flags['disposition-before'];
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

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let retentions = await this.client.retentionPolicies.getAllFileVersionRetentions(options);
		await this.output(retentions);
	}
}

RetentionPoliciesListVersionRetentionCommand.description = 'List all file version retentions for your enterprise';
RetentionPoliciesListVersionRetentionCommand.examples = [
	'box retention-policies:file-version-retentions'
];
RetentionPoliciesListVersionRetentionCommand._endpoint = 'get_file_version_retentions';

RetentionPoliciesListVersionRetentionCommand.flags = {
	...BoxCommand.flags,
	'disposition-action': flags.string({
		description: 'A disposition action to filter by',
		options: [
			'permanently_delete',
			'remove_retention'
		]
	}),
	'disposition-after': flags.string({
		description: 'A date to filter retention policies that complete after a certain time',
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'disposition-before': flags.string({
		description: 'A date to filter retention policies that complete before a certain time',
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'file-id': flags.string({ description: 'A file id to filter the file version retentions by' }),
	'file-version-id': flags.string({ description: 'A file version id to filter the file version retentions by' }),
	'policy-id': flags.string({ description: 'A policy id to filter the file version retentions by' })
};

module.exports = RetentionPoliciesListVersionRetentionCommand;
