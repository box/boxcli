'use strict';

const { Flags } = require('@oclif/core');

const MAX_LIMIT = 1000;

/**
 * Sets correct limit option based on max-items flag.
 * If max-items is not present limit is set to 1000
 *
 * @param {Object} commandFlags Flags from the command
 * @returns {Object} Options for http request
 * @private
 *
 **/
function parsePaginationFlags(commandFlags) {
	let limitFlag =
		commandFlags['max-items'] === undefined
			? MAX_LIMIT
			: commandFlags['max-items'];

	if (limitFlag <= 0) {
		throw new Error('Max items must be greater than 0');
	}

	let options = { limit: Math.min(MAX_LIMIT, limitFlag) };

	return options;
}

module.exports = {
	forceMarkerPagination(commandFlags) {
		let options = parsePaginationFlags(commandFlags);
		options.usemarker = true;

		return options;
	},

	handlePagination(commandFlags) {
		return parsePaginationFlags(commandFlags);
	},
};

module.exports.flags = Object.freeze({
	'max-items': Flags.integer({
		description:
			'A value that indicates the maximum number of results to return. This only specifies a maximum boundary and will not guarantee the minimum number of results returned. When the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will be made.',
	}),
});
