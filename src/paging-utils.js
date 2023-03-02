'use strict';

const { flags } = require('@oclif/command');

function parsePagingFlags(limit, page) {
	let options = {};
	if (limit) {
		options.limit = limit;
	}
	if (page && page != 1) {
		options.offset = (page - 1) * limit;
	}

	return options;
}

module.exports = {
	parseMarkerParams(limit, page, command) {
		let options = parsePagingFlags(limit, page);
		command.markerBased = true;

		return options;
	},

	parseOffsetParams(limit, page) {
		return parsePagingFlags(limit, page);
	},
};

module.exports.pagingFlags = Object.freeze({
	//TODO max limit is 1000, we could support more by doing a pagination but we still need to send correct value to the API
	limit: flags.integer({
		description:
			'A value that indicates the maximum number of results to return for a single request. This only specifies a maximum boundary and will not guarantee the minimum number of results returned.',
	}),
	page: flags.integer({
		description: 'From which page to receive results from.',
		default: 1,
	}),
});
