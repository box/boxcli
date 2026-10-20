'use strict';

/**
 * Reports what the CLI is doing to the terminal with the Program Status
 * Protocol (OSC 7501): https://www.superlogical.com/rex/docs/build/program-status
 *
 * Terminals that don't support the protocol ignore the sequence. Reports go to
 * stderr and only when it is a TTY, so piped or redirected output stays clean.
 */

const APP_NAME = 'box-cli';
const OSC_PREFIX = '\u001B]7501;';
const STRING_TERMINATOR = '\u001B\\';
const MAX_MSG_BYTES = 2048;
const ELLIPSIS = '…';
const KINDS = new Set(['permission', 'question', 'auth']);
const PROGRESS_STATES = new Set(['working', 'blocked']);
const SIGNALS = ['SIGINT', 'SIGTERM'];
const ENV_VARIABLE = 'BOX_PROGRAM_STATUS';
const DISABLE_VALUES = new Set(['0', 'false', 'off', 'no']);
const ENABLE_VALUES = new Set(['1', 'true', 'on', 'yes']);

/* eslint-disable no-control-regex */
const ANSI_CSI_PATTERN = /\u001B\[[0-?]*[ -/]*[@-~]/gu;
const ANSI_OSC_PATTERN = /\u001B\][^\u0007\u001B]*(?:\u0007|\u001B\\)?/gu;
const ANSI_ESCAPE_PATTERN = /\u001B[@-Z\\-_]?/gu;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F-\u009F]+/gu;
/* eslint-enable no-control-regex */
const INVISIBLE_FORMATTING_PATTERN =
	/[\u061C\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/gu;

/**
 * Turn arbitrary text into a single line the protocol accepts: no ANSI
 * styling, control characters, or invisible text direction formatting.
 *
 * @param {*} text The text to sanitize
 * @returns {string} The sanitized single-line text
 */
function sanitizeText(text) {
	if (text === undefined || text === null) {
		return '';
	}
	return String(text)
		.replaceAll(ANSI_OSC_PATTERN, '')
		.replaceAll(ANSI_CSI_PATTERN, '')
		.replaceAll(ANSI_ESCAPE_PATTERN, '')
		.replaceAll(CONTROL_CHARACTER_PATTERN, ' ')
		.replaceAll(INVISIBLE_FORMATTING_PATTERN, '')
		.replaceAll(/\s+/gu, ' ')
		.trim();
}

/**
 * Shorten text to fit in a number of UTF-8 bytes without splitting a character
 *
 * @param {string} text The text to shorten
 * @param {number} maxBytes The maximum encoded length in bytes
 * @returns {string} The text, ending in an ellipsis if it was shortened
 */
function truncateUtf8(text, maxBytes) {
	if (Buffer.byteLength(text, 'utf8') <= maxBytes) {
		return text;
	}
	const budget = maxBytes - Buffer.byteLength(ELLIPSIS, 'utf8');
	let used = 0;
	let result = '';
	for (const character of text) {
		const size = Buffer.byteLength(character, 'utf8');
		if (used + size > budget) {
			break;
		}
		used += size;
		result += character;
	}
	return result + ELLIPSIS;
}

/**
 * Encode a free-text value (msg) as the protocol requires
 *
 * @param {*} text The text to encode
 * @returns {string} Base64 of the sanitized UTF-8 text, or '' if nothing is left
 */
function encodeText(text) {
	const sanitized = truncateUtf8(sanitizeText(text), MAX_MSG_BYTES);
	return sanitized ? Buffer.from(sanitized, 'utf8').toString('base64') : '';
}

/**
 * Build one OSC 7501 report
 *
 * @param {Object} record The record to report
 * @param {string} record.state idle, working, done, blocked, or error
 * @param {string} [record.kind] permission, question, or auth; only used with blocked
 * @param {number} [record.progress] Percentage; only used with working or blocked
 * @param {string} [record.msg] One human-readable line
 * @returns {string} The escape sequence
 */
function formatReport({ state, kind, progress, msg }) {
	const pairs = [`state=${state}`];
	if (state === 'blocked' && KINDS.has(kind)) {
		pairs.push(`kind=${kind}`);
	}
	if (PROGRESS_STATES.has(state) && Number.isFinite(progress)) {
		const percentage = Math.min(100, Math.max(0, Math.floor(progress)));
		pairs.push(`progress=${percentage}`);
	}
	pairs.push(`app=${APP_NAME}`);
	const encodedMessage = encodeText(msg);
	if (encodedMessage) {
		pairs.push(`msg=${encodedMessage}`);
	}
	return `${OSC_PREFIX}${pairs.join(':')}${STRING_TERMINATOR}`;
}

/**
 * Decide whether reports should be written
 *
 * @param {Object} options Inputs to the decision
 * @param {Object} options.stream The stream reports would be written to
 * @param {Object} options.env Environment variables
 * @param {Object} [options.settings] CLI settings
 * @returns {boolean} True if reports should be written
 */
function isEnabled({ stream, env, settings }) {
	const override = String(env[ENV_VARIABLE] ?? '')
		.trim()
		.toLowerCase();
	if (DISABLE_VALUES.has(override)) {
		return false;
	}
	if (ENABLE_VALUES.has(override)) {
		return true;
	}
	if (settings && settings.enableProgramStatus === false) {
		return false;
	}
	if (env.TERM === 'dumb') {
		return false;
	}
	return Boolean(stream && stream.isTTY);
}

/**
 * Tracks and reports the status of one command run
 */
class ProgramStatus {
	/**
	 * @param {Object} [options] Options
	 * @param {Object} [options.stream] Where to write reports, defaults to stderr
	 * @param {Object} [options.env] Environment variables, defaults to process.env
	 * @param {Object} [options.settings] CLI settings
	 * @param {boolean} [options.enabled] Force reporting on or off
	 * @param {string} [options.label] Human-readable name of the command
	 */
	constructor({
		stream = process.stderr,
		env = process.env,
		settings,
		enabled,
		label = 'box',
	} = {}) {
		this.stream = stream;
		this.enabled = enabled ?? isEnabled({ stream, env, settings });
		this.label = label;
		this._lastReport = null;
		this._working = null;
		this._outcome = null;
		this._started = false;
		this._finished = false;
		this._signalHandlers = null;
	}

	get started() {
		return this._started;
	}

	/**
	 * Report that the command has started working
	 *
	 * @param {string} [msg] What the command is doing
	 * @returns {void}
	 */
	start(msg = `Running ${this.label}`) {
		if (!this.enabled || this._started) {
			return;
		}
		this._started = true;
		this._installSignalHandlers();
		this.working(msg);
	}

	/**
	 * Report working, optionally with a percentage. The message and progress are
	 * remembered so resume() can restore them after the user answers a prompt.
	 *
	 * @param {string} [msg] What the command is doing; keeps the previous one if omitted
	 * @param {number} [progress] Percentage complete; indeterminate if omitted
	 * @returns {void}
	 */
	working(msg, progress) {
		this._working = {
			msg: msg ?? this._working?.msg,
			progress,
		};
		this._report({ state: 'working', ...this._working });
	}

	/**
	 * Report that the command is waiting on the user
	 *
	 * @param {string} kind permission, question, or auth
	 * @param {string} msg What the command is waiting for
	 * @returns {void}
	 */
	blocked(kind, msg) {
		this._report({ state: 'blocked', kind, msg });
	}

	/**
	 * Return to the last working state after being blocked
	 *
	 * @returns {void}
	 */
	resume() {
		if (this._working) {
			this._report({ state: 'working', ...this._working });
		}
	}

	/**
	 * Set the message reported when the command finishes successfully
	 *
	 * @param {string} msg What the command finished
	 * @returns {void}
	 */
	succeed(msg) {
		this._outcome = { state: 'done', msg };
	}

	/**
	 * Mark the command as failed, for commands that report a failure without throwing
	 *
	 * @param {string} msg What failed
	 * @returns {void}
	 */
	fail(msg) {
		this._outcome = { state: 'error', msg };
	}

	/**
	 * Mark the command as cancelled by the user
	 *
	 * @param {string} [msg] What was cancelled
	 * @returns {void}
	 */
	cancel(msg = `Cancelled ${this.label}`) {
		this._outcome = { state: 'idle', msg };
	}

	/**
	 * Report the final state, right before the command exits
	 *
	 * @param {Error} [error] The error the command ended with, if any
	 * @returns {void}
	 */
	finish(error) {
		this._removeSignalHandlers();
		if (!this._started || this._finished) {
			this._finished = true;
			return;
		}
		let outcome = this._outcome;
		const failed =
			error && !(error.code === 'EEXIT' && error.oclif?.exit === 0);
		if (failed && outcome?.state !== 'error') {
			outcome = {
				state: 'error',
				msg: `${this.label} failed: ${error.message}`,
			};
		}
		if (!outcome) {
			outcome = { state: 'done', msg: `Finished ${this.label}` };
		}
		this._report(outcome);
		this._finished = true;
	}

	_report(record) {
		if (!this.enabled || this._finished) {
			return;
		}
		this._started = true;
		const report = formatReport(record);
		if (report === this._lastReport) {
			return;
		}
		this._lastReport = report;
		try {
			this.stream.write(report);
		} catch {
			// Status reports are best effort and must never break a command
		}
	}

	_installSignalHandlers() {
		if (this._signalHandlers) {
			return;
		}
		this._signalHandlers = new Map();
		for (const signal of SIGNALS) {
			const handler = () => {
				this._removeSignalHandlers();
				this._report({ state: 'idle', msg: `Cancelled ${this.label}` });
				this._finished = true;
				// Only re-raise when nothing else handles the signal, so the
				// default exit behavior is the same as without this handler
				if (process.listenerCount(signal) === 0) {
					process.kill(process.pid, signal);
				}
			};
			this._signalHandlers.set(signal, handler);
			process.once(signal, handler);
		}
	}

	_removeSignalHandlers() {
		if (!this._signalHandlers) {
			return;
		}
		for (const [signal, handler] of this._signalHandlers) {
			process.removeListener(signal, handler);
		}
		this._signalHandlers = null;
	}
}

module.exports = {
	APP_NAME,
	ENV_VARIABLE,
	ProgramStatus,
	formatReport,
	isEnabled,
	sanitizeText,
	truncateUtf8,
};
