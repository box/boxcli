'use strict';

const BoxCommand = require('../box-command');

class RecentItems extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RecentItems);

		let recentItems = await this.client.recentItems.get();
		await this.output(recentItems);
	}
}

RecentItems.description = 'List information about files accessed in the past 90 days up to a 1000 items';

RecentItems.flags = {
	...BoxCommand.flags
};

module.exports = RecentItems;
