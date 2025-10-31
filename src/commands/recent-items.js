'use strict';

const BoxCommand = require('../box-command');
const PaginationUtils = require('../pagination-utils');

class RecentItems extends BoxCommand {
	async run() {
		const { flags } = await this.parse(RecentItems);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let recentItems = await this.client.recentItems.get(options);
		await this.output(recentItems);
	}
}

RecentItems.description =
	'List information about files accessed in the past 90 days up to a 1000 items';
RecentItems.examples = ['box recent-items'];
RecentItems._endpoint = 'get_recent_items';

RecentItems.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
};

module.exports = RecentItems;
