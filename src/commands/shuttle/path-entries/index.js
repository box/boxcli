'use strict';

const { Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');
const { jobIdFlag } = require('../../../modules/shuttle');

class ShuttlePathEntriesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttlePathEntriesListCommand);
		const queryParams = {
			jobId: flags['job-id'],
			side: flags.side,
		};

		if (Object.hasOwn(flags, 'path')) {
			queryParams.path = flags.path;
		}
		if (Object.hasOwn(flags, 'path-id')) {
			queryParams.pathId = flags['path-id'];
		}
		if (Object.hasOwn(flags, 'account-email')) {
			queryParams.accountEmail = flags['account-email'];
		}

		const entries = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttlePathEntriesV2026R0(
					pageQueryParams
				),
			queryParams
		);
		await this.output(entries);
	}
}

ShuttlePathEntriesListCommand.aliases = ['shuttle:path-entries:list'];
ShuttlePathEntriesListCommand.description =
	'Browse the source or target paths of a Box Shuttle job, one level at a time. Pass only --job-id and --side to list the roots, then --path, --path-id or both to list the children of an entry. Each entry has path, path_id, is_directory and a scope (account or shared_space), which give the location flags of shuttle:path-mappings:create. Valid values depend on the system';
ShuttlePathEntriesListCommand.examples = [
	'box shuttle:path-entries --job-id 6a3ba68e810d9156194530a1 --side source',
	'box shuttle:path-entries --job-id 6a3ba68e810d9156194530a1 --side source --path /finance --account-email user@example.com',
];
ShuttlePathEntriesListCommand._endpoint = 'get_shuttle_path_entries';

ShuttlePathEntriesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': jobIdFlag('ID of the shuttle job whose path entries to list'),
	side: Flags.string({
		description: 'Side of the migration to browse. One of: source, target',
		options: ['source', 'target'],
		required: true,
	}),
	path: Flags.string({
		description:
			'Human-readable path of the parent entry whose children are listed. Leave out, or pass /, to list the roots',
	}),
	'path-id': Flags.string({
		description:
			'path_id of the parent entry whose children are listed. Tells apart paths with identical names on systems with stable identifiers',
	}),
	'account-email': Flags.string({
		description:
			'Email of the account whose path entries are listed. A system-native identifier, not always an email address',
	}),
};

module.exports = ShuttlePathEntriesListCommand;
