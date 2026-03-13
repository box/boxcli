'use strict';

// restore-cursor@3 (used by inquirer@8) calls require('signal-exit') as a
// function, but signal-exit@4 exports an object with an onExit() method.
//
// Locally, npm nests signal-exit@3 under restore-cursor, so both versions
// coexist. In the standalone Windows build produced by oclif pack:win, module
// resolution ends up pointing restore-cursor to top-level signal-exit@4
// (effectively like a flattened/deduped node_modules layout), which causes
// "signalExit is not a function" on Windows.
//
// Node's lookup order for require('signal-exit') from restore-cursor is:
// 1) restore-cursor/node_modules/signal-exit
// 2) parent node_modules/signal-exit
// If step (1) is absent in the packaged layout, step (2) resolves to v4.
//
// This started surfacing after dependency-tree changes included in v4.5.0
// (notably commit 4f4254d), where top-level signal-exit moved to 4.1.0.
//
// This shim wraps the v4 object export as a callable function before inquirer
// (and its restore-cursor dependency) is loaded.

const SIGNAL_EXIT_ID = 'signal-exit';
const signalExit = require(SIGNAL_EXIT_ID);

if (
	typeof signalExit !== 'function' &&
	typeof signalExit.onExit === 'function'
) {
	const compatSignalExit = (...args) => signalExit.onExit(...args);
	Object.assign(compatSignalExit, signalExit);

	const resolvedPath = require.resolve(SIGNAL_EXIT_ID);
	if (require.cache[resolvedPath]) {
		require.cache[resolvedPath].exports = compatSignalExit;
	}
}

module.exports = require('inquirer');
