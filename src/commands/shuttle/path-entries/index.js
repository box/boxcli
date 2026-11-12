'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttlePathEntriesListCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttlePathEntriesListCommand);
		if (!flags['job-id'] || !flags.side) {
			this.error('--job-id and --side are required.');
		}
		const query = {
			jobId: flags['job-id'],
			side: flags.side,
		};
		if (flags.path !== undefined) {
			query.path = flags.path;
		}
		if (flags['path-id'] !== undefined) {
			query.pathId = flags['path-id'];
		}
		if (flags['account-email'] !== undefined) {
			query.accountEmail = flags['account-email'];
		}
		const entries = await this.markerPagination(
			(pageQueryParams) =>
				this.tsClient.shuttle.getShuttlePathEntriesV2026R0(pageQueryParams),
			query
		);
		await this.output(entries);
	}
}

ShuttlePathEntriesListCommand.aliases = ['shuttle:path-entries:list'];
ShuttlePathEntriesListCommand.description =
	'List shuttle path entries for a job side';
ShuttlePathEntriesListCommand.examples = [
	'box shuttle:path-entries --job-id 6a315c0754833bfc5df067bf --side source',
];
ShuttlePathEntriesListCommand._endpoint = 'get_shuttle_path_entries';

ShuttlePathEntriesListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
	'job-id': Flags.string({
		description: 'Shuttle job ID',
		required: true,
	}),
	side: Flags.string({
		description: 'Which side of the migration to browse',
		options: ['source', 'target'],
		required: true,
	}),
	path: Flags.string({
		description: 'Filter by path',
	}),
	'path-id': Flags.string({
		description: 'Filter by path ID',
	}),
	'account-email': Flags.string({
		description: 'Filter by account email',
	}),
};

module.exports = ShuttlePathEntriesListCommand;
