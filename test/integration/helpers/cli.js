'use strict';

const { execFile } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BIN = path.join(__dirname, '..', '..', '..', 'bin', 'run');
const DISABLE_SECURE_STORAGE = path.join(
	__dirname,
	'..',
	'disable-secure-storage.js'
);
const MAX_STDERR = 2048;

const { userId, adminUserId } = require('./account');

let home = null;
// The setup in progress, so calls that start together, such as in Promise.all, share one temporary home
let setup = null;
// CLI processes still running, so a signal handler can stop them before it removes the temporary home
const children = new Set();

// CI masks only the secret as it is stored, not the key or tokens derived from it, so error text is redacted here
function redact(text) {
	return String(text)
		.replaceAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '<email>')
		.replaceAll(/Bearer\s+[\w.-]+/gi, 'Bearer <token>')
		.replaceAll(/\beyJ[\w-]+\.[\w-]+\.[\w-]+/g, '<jwt>')
		.replaceAll(
			/"(clientSecret|privateKey|passphrase|client_secret|private_key|accessToken|refreshToken|access_token|refresh_token)"\s*:\s*"[^"]*"/g,
			'"$1":"<redacted>"'
		)
		.replaceAll(
			/-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/g,
			'<pem>'
		);
}

function runRaw(args) {
	return new Promise((resolve) => {
		const child = execFile(
			BIN,
			args,
			{
				env: {
					...process.env,
					HOME: home,
					NODE_OPTIONS: [
						process.env.NODE_OPTIONS,
						`--require "${DISABLE_SECURE_STORAGE}"`,
					]
						.filter(Boolean)
						.join(' '),
				},
				maxBuffer: 20 * 1024 * 1024,
			},
			(error, stdout, stderr) => {
				resolve({
					code: error ? (error.code ?? 1) : 0,
					stdout,
					stderr,
				});
			}
		);
		children.add(child);
		child.once('exit', () => children.delete(child));
	});
}

function ensureEnvironment() {
	if (!setup) {
		setup = setUpEnvironment().catch((error) => {
			cleanup();
			throw error;
		});
	}

	return setup;
}

async function setUpEnvironment() {
	const encoded = process.env.JWT_CONFIG_BASE_64;
	if (!encoded) {
		throw new Error(
			'JWT_CONFIG_BASE_64 is not set; integration tests need a Box JWT app config'
		);
	}
	home = fs.mkdtempSync(path.join(os.tmpdir(), 'boxcli-it-'));
	const configPath = path.join(home, 'jwt-config.json');
	fs.writeFileSync(configPath, Buffer.from(encoded, 'base64'), {
		mode: 0o600,
	});
	const result = await runRaw([
		'configure:environments:add',
		configPath,
		'--name',
		'it',
		'--set-as-current',
	]);
	if (result.code !== 0) {
		throw new Error(
			`configure:environments:add failed (exit ${result.code}): ${redact(result.stderr).slice(0, MAX_STDERR)}`
		);
	}
}

/**
 * Run the CLI with --json and parse stdout. Never prints command output.
 * The CLI acts as the service account of the JWT app; pass { asUser: true }
 * to act as USER_ID or { asAdmin: true } to act as ADMIN_USER_ID, through the
 * As-User header.
 */
async function run(
	args,
	{ asUser = false, asAdmin = false, json = true } = {}
) {
	if (asUser && asAdmin) {
		throw new TypeError('run takes asUser or asAdmin, not both');
	}
	const actAs = asUser ? userId() : asAdmin ? adminUserId() : null;
	await ensureEnvironment();
	const fullArgs = [...args];
	if (json) {
		fullArgs.push('--json');
	}
	if (actAs) {
		fullArgs.push(`--as-user=${actAs}`);
	}
	const result = await runRaw(fullArgs);
	if (result.code !== 0) {
		const error = new Error(
			`box ${args.join(' ')} failed (exit ${result.code}): ${redact(result.stderr).slice(0, MAX_STDERR)}`
		);
		error.result = result;
		throw error;
	}
	return {
		...result,
		output: json && result.stdout.trim() ? JSON.parse(result.stdout) : null,
	};
}

/**
 * The HTTP status of an API error the CLI printed, or null. Both SDK clients
 * put it in brackets after a message, such as "Unexpected API Response
 * [404 Not Found | …]" or "Expired Auth: … [401 Unauthorized]"; an error
 * without a response body starts a line with it, such as "404 not_found …".
 */
function statusOf(stderr) {
	// eslint-disable-next-line no-control-regex
	const text = String(stderr).replaceAll(/\u001B\[[\d;]*m/g, '');
	const match = text.match(/\[(\d{3}) [^\]]*\]/) || text.match(/^(\d{3})\b/m);

	return match ? Number(match[1]) : null;
}

/**
 * Run a command that must fail with the given HTTP status, such as 404 for an
 * item the test deleted. Returns the error. Throws when the command succeeds
 * or fails another way, so a case never passes on an authentication error.
 */
async function expectFailure(
	args,
	{ status, asUser = false, asAdmin = false, json = true } = {}
) {
	if (!Number.isInteger(status)) {
		throw new TypeError(
			'expectFailure needs the expected HTTP status, such as { status: 404 }'
		);
	}
	let failure;
	try {
		await run(args, { asUser, asAdmin, json });
	} catch (error) {
		failure = error;
	}
	if (!failure) {
		throw new Error(
			`box ${args.join(' ')} succeeded, expected it to fail with ${status}`
		);
	}
	if (!failure.result) {
		throw failure;
	}
	const actual = statusOf(failure.result.stderr);
	if (actual !== status) {
		throw new Error(
			`box ${args.join(' ')} failed with ${actual ?? 'no HTTP status'}, expected ${status}: ${redact(failure.result.stderr).slice(0, MAX_STDERR)}`
		);
	}

	return failure;
}

/**
 * The temporary home of the CLI processes, set up on first use, for files a
 * test hands to the CLI. It is removed by cleanup().
 */
async function homeDirectory() {
	await ensureEnvironment();

	return home;
}

function cleanup() {
	setup = null;
	if (home) {
		fs.rmSync(home, { recursive: true, force: true });
		home = null;
	}
}

// The temporary home holds the JWT config and the token cache: remove it even when a run ends without the after hooks
process.on('exit', cleanup);
// Ctrl+C or a cancelled CI job ends the process without the 'exit' event, so clean up on these signals too.
// Stop the running CLI processes first: one still running could write its token cache after the cleanup.
// Then raise the signal again: the listener is gone, so the process ends the default way.
for (const signal of ['SIGINT', 'SIGTERM']) {
	process.once(signal, async () => {
		await Promise.all(
			[...children].map(
				(child) =>
					new Promise((resolve) => {
						child.once('exit', resolve);
						child.kill('SIGTERM');
					})
			)
		);
		cleanup();
		// Used when the process runs out of work and exits before the raised signal arrives
		process.exitCode = 128 + os.constants.signals[signal];
		process.kill(process.pid, signal);
	});
}

module.exports = {
	run,
	expectFailure,
	homeDirectory,
	cleanup,
	redact,
	statusOf,
};
