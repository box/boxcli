'use strict';

// Loaded into every CLI process the integration tests start. With HOME set to
// a temporary directory the OS keychain is unreachable (macOS prompts for a
// missing keychain), so the CLI must fall back to its file token cache.
const Module = require('node:module');

const BLOCKED = new Set(['keychain', '@github/keytar']);
const originalLoad = Module._load;

Module._load = function (request, ...rest) {
	if (BLOCKED.has(request)) {
		throw new Error(`${request} is disabled in integration tests`);
	}
	return originalLoad.call(this, request, ...rest);
};
