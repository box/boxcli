'use strict';

const BoxCommand = require('../../box-command');
const PaginationUtilities = require('../../pagination-utils');

class CollaborationsGetPendingCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(CollaborationsGetPendingCommand);
		let options = PaginationUtilities.handlePagination(flags);
		let parameters = {
			qs: {
				status: 'pending',
				limit: options.limit,
			},
		};

		if (flags.fields) {
			parameters.qs.fields = flags.fields;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		let collaborations = await this.client.wrapWithDefaultHandler(
			this.client.get
		)('/collaborations', parameters);
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
	...PaginationUtilities.flags,
};

module.exports = CollaborationsGetPendingCommand;
