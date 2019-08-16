'use strict';

const BoxCommand = require('../box-command');

class RecentItems extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(RecentItems);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let recentItems = await this.client.recentItems.get(options);
		await this.output(recentItems);
	}
}

RecentItems.description = 'List information about files accessed in the past 90 days up to a 1000 items';
RecentItems.examples = [
	'box recent-items'
];
RecentItems._endpoint = 'get_recent_items';

RecentItems.flags = {
	...BoxCommand.flags
};

module.exports = RecentItems;
