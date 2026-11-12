'use strict';

const BoxCommand = require('../../../box-command');
const PaginationUtilities = require('../../../pagination-utils');

class ShuttleSystemsListCommand extends BoxCommand {
	async run() {
		await this.parse(ShuttleSystemsListCommand);
		const systems = await this.markerPagination((pageQueryParams) =>
			this.tsClient.shuttle.getShuttleSystemsV2026R0(pageQueryParams)
		);
		await this.output(systems);
	}
}

ShuttleSystemsListCommand.aliases = ['shuttle:systems:list'];
ShuttleSystemsListCommand.description = 'List shuttle systems';
ShuttleSystemsListCommand.examples = ['box shuttle:systems', 'box shuttle:systems --max-items 50'];
ShuttleSystemsListCommand._endpoint = 'get_shuttle_systems';

ShuttleSystemsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flags,
};

module.exports = ShuttleSystemsListCommand;
