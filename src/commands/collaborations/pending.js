'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtils = require('../../pagination-utils');

class CollaborationsGetPendingCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(CollaborationsGetPendingCommand);
		let options = PaginationUtils.handlePagination(flags);
		let params = {
			qs: {
				status: 'pending',
				limit: options.limit,
			},
		};

		if (flags.fields) {
			params.qs.fields = flags.fields;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		let collaborations = await this.client.wrapWithDefaultHandler(
			this.client.get
		)('/collaborations', params);
		await this.output(collaborations);
	}
}

CollaborationsGetPendingCommand.aliases = ['collaborations:get-pending'];

CollaborationsGetPendingCommand.description =
	'List all pending collaborations for a user';
CollaborationsGetPendingCommand.examples = ['box collaborations:pending'];
CollaborationsGetPendingCommand._endpoint = 'get_collaborations pending';

CollaborationsGetPendingCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

module.exports = CollaborationsGetPendingCommand;
