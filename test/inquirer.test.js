'use strict';

const { assert } = require('chai');
const sinon = require('sinon');

const handler = () => {};

// The shim in src/inquirer normalizes signal-exit across versions:
// newer versions export an object with onExit(), while older behavior expects
// a callable function. These tests assert both compatibility paths.
describe('inquirer compatibility shim', function () {
	const MODULE_UNDER_TEST = '../src/inquirer';
	const signalExitPath = require.resolve('signal-exit');
	const inquirerPath = require.resolve('inquirer');

	let originalSignalExitCacheEntry;
	let originalInquirerCacheEntry;

	beforeEach(function () {
		// Snapshot and reset module cache so each test can inject a custom
		// signal-exit export and re-run the shim from a clean state.
		originalSignalExitCacheEntry = require.cache[signalExitPath];
		originalInquirerCacheEntry = require.cache[inquirerPath];
		delete require.cache[require.resolve(MODULE_UNDER_TEST)];
	});

	afterEach(function () {
		if (originalSignalExitCacheEntry) {
			require.cache[signalExitPath] = originalSignalExitCacheEntry;
		} else {
			delete require.cache[signalExitPath];
		}

		if (originalInquirerCacheEntry) {
			require.cache[inquirerPath] = originalInquirerCacheEntry;
		} else {
			delete require.cache[inquirerPath];
		}

		delete require.cache[require.resolve(MODULE_UNDER_TEST)];
	});

	it('should wrap object-style signal-exit export as callable function', function () {
		// Simulate modern signal-exit shape (object export with onExit method).
		const onExitStub = sinon.stub().returns('cleanup-callback');
		const signalExitObjectExport = {
			onExit: onExitStub,
			load: sinon.stub(),
			unload: sinon.stub(),
		};

		require.cache[signalExitPath] = {
			id: signalExitPath,
			filename: signalExitPath,
			loaded: true,
			exports: signalExitObjectExport,
		};

		const shimmedInquirer = require(MODULE_UNDER_TEST);
		const rawInquirer = require('inquirer');
		const patchedSignalExit = require('signal-exit');

		// The shim should not replace inquirer itself; only signal-exit behavior.
		assert.strictEqual(shimmedInquirer, rawInquirer);
		assert.strictEqual(typeof patchedSignalExit, 'function');
		assert.strictEqual(patchedSignalExit.onExit, onExitStub);

		const result = patchedSignalExit(handler, { alwaysLast: true });
		assert.strictEqual(result, 'cleanup-callback');
		assert.isTrue(
			onExitStub.calledOnceWithExactly(handler, { alwaysLast: true })
		);
	});

	it('should preserve function-style signal-exit export', function () {
		// If signal-exit is already callable, shim should leave it untouched.
		const signalExitFunctionExport = sinon
			.stub()
			.returns('already-callable');

		require.cache[signalExitPath] = {
			id: signalExitPath,
			filename: signalExitPath,
			loaded: true,
			exports: signalExitFunctionExport,
		};

		require(MODULE_UNDER_TEST);
		const patchedSignalExit = require('signal-exit');

		assert.strictEqual(patchedSignalExit, signalExitFunctionExport);
		assert.strictEqual(patchedSignalExit(), 'already-callable');
	});
});
