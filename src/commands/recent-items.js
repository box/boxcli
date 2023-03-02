'use strict';

const BoxCommand = require('../box-command');
const PagingUtils = require('../paging-utils');

class RecentItems extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RecentItems);
		let options = PagingUtils.parseMarkerParams(flags.limit, flags.page, this);

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
	...PagingUtils.pagingFlags,
};

module.exports = RecentItems;
