'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class CollaborationsGetPendingCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(CollaborationsGetPendingCommand);
		let params = {
			qs: {
				status: 'pending'
			}
		};

		if (flags.fields) {
			params.qs.fields = flags.fields;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		let collaborations = await this.client.wrapWithDefaultHandler(this.client.get)('/collaborations', params);
		await this.output(collaborations);
	}
}

CollaborationsGetPendingCommand.aliases = [ 'collaborations:get-pending' ];

CollaborationsGetPendingCommand.description = 'List all pending collaborations for a user';

CollaborationsGetPendingCommand.flags = {
	...BoxCommand.flags,
};

module.exports = CollaborationsGetPendingCommand;
