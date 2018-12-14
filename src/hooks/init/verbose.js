'use strict';

const debug = require('debug');

module.exports = function(options) {
	if (Array.isArray(options.argv) && options.argv.some(f => f === '-v' || f === '--verbose')) {
		debug.enable('box*');
	}
};
