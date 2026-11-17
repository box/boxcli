'use strict';

// Mocha stops a test after 120 seconds (test:integration), so a wait must end well before that
const MAX_TIMEOUT_SECONDS = 90;

/**
 * Call check until it returns a truthy value, and return that value. A check
 * that throws, such as a run() of an item the API does not show yet, counts as
 * not ready. After timeoutSeconds, rethrow the last error, or fail.
 * Use it only where the box-node-sdk test waits (delayInSeconds) for the API.
 */
async function waitFor(
	check,
	{ timeoutSeconds = 30, intervalSeconds = 2 } = {}
) {
	if (typeof check !== 'function') {
		throw new TypeError(
			'waitFor needs a function that checks the condition'
		);
	}
	if (!(timeoutSeconds > 0 && timeoutSeconds <= MAX_TIMEOUT_SECONDS)) {
		throw new RangeError(
			`waitFor needs timeoutSeconds between 0 and ${MAX_TIMEOUT_SECONDS}`
		);
	}
	const deadline = Date.now() + timeoutSeconds * 1000;
	let lastError = null;
	for (;;) {
		try {
			const value = await check();
			if (value) {
				return value;
			}
			lastError = null;
		} catch (error) {
			lastError = error;
		}
		if (Date.now() + intervalSeconds * 1000 > deadline) {
			break;
		}
		await new Promise((resolve) => {
			setTimeout(resolve, intervalSeconds * 1000);
		});
	}
	throw (
		lastError ??
		new Error(`waitFor: the condition was not met in ${timeoutSeconds} s`)
	);
}

module.exports = { waitFor };
