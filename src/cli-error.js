'use strict';

const os = require('os');

/**
 * Wrapper for lower-level errors, so we can give reasonable error messages without losing the original message/stack
 * This error deliberately elides its own stack trace; it is intended to be directly displayed to users
 */
class BoxCLIError extends Error {

	/**
     * Create the wrapped error
     *
     * @param {string} message Error message
     * @param {Error} [cause] The lower-level error that caused this error
     * @constructor
     */
	constructor(message, cause) {
		super(message);
		this.name = 'BoxCLIError';
		this.cause = cause;

		if (cause) {
			this.stack = `${this.name}: ${this.message}${os.EOL}Caused by: ${cause.stack}`;
		}
	}
}

module.exports = BoxCLIError;
