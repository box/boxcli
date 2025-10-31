'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtils = require('../../../pagination-utils');

class RetentionPoliciesListVersionRetentionCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(
			RetentionPoliciesListVersionRetentionCommand
		);
		let options = PaginationUtils.handlePagination(flags);

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

		let retentions =
			await this.client.retentionPolicies.getAllFileVersionRetentions(
				options
			);
		await this.output(retentions);
	}
}

RetentionPoliciesListVersionRetentionCommand.description =
	'List all file version retentions for your enterprise';
RetentionPoliciesListVersionRetentionCommand.examples = [
	'box retention-policies:file-version-retentions',
];
RetentionPoliciesListVersionRetentionCommand._endpoint =
	'get_file_version_retentions';

RetentionPoliciesListVersionRetentionCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	'disposition-action': Flags.string({
		description: 'A disposition action to filter by',
		options: ['permanently_delete', 'remove_retention'],
	}),
	'disposition-after': Flags.string({
		description:
			'A date to filter retention policies that complete after a certain time',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'disposition-before': Flags.string({
		description:
			'A date to filter retention policies that complete before a certain time',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'file-id': Flags.string({
		description: 'A file id to filter the file version retentions by',
	}),
	'file-version-id': Flags.string({
		description:
			'A file version id to filter the file version retentions by',
	}),
	'policy-id': Flags.string({
		description: 'A policy id to filter the file version retentions by',
	}),
};

module.exports = RetentionPoliciesListVersionRetentionCommand;
