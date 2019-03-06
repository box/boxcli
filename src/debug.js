'use strict';

const debug = require('debug');

module.exports = Object.freeze({
	init: debug('box-cli:init'),
	execute: debug('box-cli:execute'),
	output: debug('box-cli:output'),
});
