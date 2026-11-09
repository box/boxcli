'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const { test } = require('@oclif/test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const inquirer = require('inquirer');
const BoxCommand = require('../src/box-command');
const {
	ProgramStatus,
	formatReport,
	isEnabled,
	sanitizeText,
	truncateUtf8,
} = require('../src/program-status');
const {
	TEST_API_ROOT,
	getProgramStatusReports: parseReports,
} = require('./helpers/test-helper');

function createStream({ isTTY = true } = {}) {
	const writes = [];
	return {
		isTTY,
		writes,
		write(chunk) {
			writes.push(chunk);
			return true;
		},
		reports() {
			return parseReports(writes.join(''));
		},
	};
}

function createCommand({ yes = false, isBulk = false } = {}) {
	const command = new BoxCommand([], { bin: 'box' });
	command.flags = { yes };
	command.isBulk = isBulk;
	const stream = createStream();
	command._programStatus = new ProgramStatus({
		stream,
		enabled: true,
		label: 'box files:download',
	});
	command.programStatus.working('Downloading a.txt', 30);
	return { command, stream };
}

describe('Program status', function () {
	const sandbox = sinon.createSandbox();

	afterEach(function () {
		sandbox.verifyAndRestore();
	});

	describe('formatReport()', function () {
		it('should build an OSC 7501 report terminated with ST', function () {
			assert.equal(
				formatReport({ state: 'working', msg: 'Uploading a.txt' }),
				`\u001B]7501;state=working:app=box-cli:msg=${Buffer.from('Uploading a.txt').toString('base64')}\u001B\\`
			);
		});

		it('should only include kind for blocked reports with a known kind', function () {
			assert.include(
				formatReport({ state: 'blocked', kind: 'permission' }),
				'state=blocked:kind=permission:app=box-cli'
			);
			assert.notInclude(
				formatReport({ state: 'blocked', kind: 'unknown' }),
				'kind='
			);
			assert.notInclude(
				formatReport({ state: 'done', kind: 'auth' }),
				'kind='
			);
		});

		it('should report progress as a whole number from 0 to 100 for working and blocked', function () {
			assert.include(
				formatReport({ state: 'working', progress: 42.9 }),
				'progress=42:'
			);
			assert.include(
				formatReport({ state: 'working', progress: 150 }),
				'progress=100:'
			);
			assert.include(
				formatReport({ state: 'blocked', progress: -5 }),
				'progress=0:'
			);
			assert.notInclude(
				formatReport({ state: 'working', progress: Number.NaN }),
				'progress='
			);
			assert.notInclude(
				formatReport({ state: 'done', progress: 50 }),
				'progress='
			);
		});

		it('should leave out msg when there is no text', function () {
			assert.equal(
				formatReport({ state: 'done', msg: ' \n ' }),
				'\u001B]7501;state=done:app=box-cli\u001B\\'
			);
		});

		it('should keep reports with very long messages under the protocol limits', function () {
			const report = formatReport({
				state: 'blocked',
				kind: 'question',
				progress: 50,
				msg: '\u{1F4C1}'.repeat(5000),
			});
			const [record] = parseReports(report);
			assert.isBelow(Buffer.byteLength(report), 4096);
			assert.isAtMost(Buffer.byteLength(record.msg), 2048);
			assert.isTrue(record.msg.endsWith('…'));
			assert.notInclude(record.msg, '\uFFFD');
		});
	});

	describe('sanitizeText()', function () {
		it('should remove ANSI styling, control characters, and text direction overrides', function () {
			assert.equal(
				sanitizeText(
					'\u001B[31mCould not revoke\u001B[39m\nWhat\tnext?\u202E\u0007'
				),
				'Could not revoke What next?'
			);
		});

		it('should remove OSC sequences', function () {
			assert.equal(
				sanitizeText('a\u001B]0;title\u0007b\u001B]8;;url\u001B\\c'),
				'abc'
			);
		});
	});

	describe('truncateUtf8()', function () {
		it('should not change text that fits', function () {
			assert.equal(truncateUtf8('héllo', 6), 'héllo');
		});

		it('should shorten text on a character boundary and add an ellipsis', function () {
			const result = truncateUtf8('ééééé', 8);
			assert.equal(result, 'éé…');
			assert.isAtMost(Buffer.byteLength(result), 8);
		});
	});

	describe('isEnabled()', function () {
		it('should be enabled only when the stream is a TTY by default', function () {
			assert.isTrue(isEnabled({ stream: { isTTY: true }, env: {} }));
			assert.isFalse(isEnabled({ stream: { isTTY: false }, env: {} }));
			assert.isFalse(isEnabled({ stream: {}, env: {} }));
		});

		it('should be turned off by BOX_PROGRAM_STATUS', function () {
			for (const value of ['0', 'false', 'OFF', 'no']) {
				assert.isFalse(
					isEnabled({
						stream: { isTTY: true },
						env: { BOX_PROGRAM_STATUS: value },
					})
				);
			}
		});

		it('should be forced on by BOX_PROGRAM_STATUS', function () {
			assert.isTrue(
				isEnabled({
					stream: { isTTY: false },
					env: { BOX_PROGRAM_STATUS: '1' },
					settings: { enableProgramStatus: false },
				})
			);
		});

		it('should be turned off by the enableProgramStatus setting', function () {
			assert.isFalse(
				isEnabled({
					stream: { isTTY: true },
					env: {},
					settings: { enableProgramStatus: false },
				})
			);
		});

		it('should be turned off for dumb terminals', function () {
			assert.isFalse(
				isEnabled({ stream: { isTTY: true }, env: { TERM: 'dumb' } })
			);
		});
	});

	describe('ProgramStatus', function () {
		let statuses = [];

		function createStatus(options = {}) {
			const stream = createStream();
			const status = new ProgramStatus({
				stream,
				enabled: true,
				label: 'box files:upload',
				...options,
			});
			statuses.push(status);
			return { status, stream };
		}

		afterEach(function () {
			for (const status of statuses) {
				status.finish();
			}
			statuses = [];
		});

		it('should report working on start and done on finish', function () {
			const { status, stream } = createStatus();
			status.start();
			status.finish();
			assert.deepEqual(stream.reports(), [
				{
					state: 'working',
					app: 'box-cli',
					msg: 'Running box files:upload',
				},
				{
					state: 'done',
					app: 'box-cli',
					msg: 'Finished box files:upload',
				},
			]);
		});

		it('should not write anything when disabled', function () {
			const { status, stream } = createStatus({ enabled: false });
			status.start();
			status.blocked('auth', 'Sign in');
			status.finish(new Error('failed'));
			assert.isEmpty(stream.writes);
		});

		it('should not report a final state when nothing was started', function () {
			const { status, stream } = createStatus();
			status.finish(new Error('Bad flag'));
			assert.isEmpty(stream.writes);
		});

		it('should skip reports identical to the previous one', function () {
			const { status, stream } = createStatus();
			status.start();
			status.working('Uploading', 10.2);
			status.working('Uploading', 10.8);
			status.working('Uploading', 11);
			assert.deepEqual(
				stream.reports().map((record) => record.progress),
				[undefined, '10', '11']
			);
		});

		it('should return to the last working state after being blocked', function () {
			const { status, stream } = createStatus();
			status.start();
			status.working('Bulk: 1/4 entries', 25);
			status.blocked('permission', 'Overwrite file?');
			status.resume();
			assert.deepEqual(stream.reports().slice(-2), [
				{
					state: 'blocked',
					kind: 'permission',
					app: 'box-cli',
					msg: 'Overwrite file?',
				},
				{
					state: 'working',
					progress: '25',
					app: 'box-cli',
					msg: 'Bulk: 1/4 entries',
				},
			]);
		});

		it('should finish with the result set by succeed()', function () {
			const { status, stream } = createStatus();
			status.start();
			status.succeed('Uploaded a.txt');
			status.finish();
			assert.deepEqual(stream.reports().at(-1), {
				state: 'done',
				app: 'box-cli',
				msg: 'Uploaded a.txt',
			});
		});

		it('should finish with error when the command throws', function () {
			const { status, stream } = createStatus();
			status.start();
			status.succeed('Uploaded a.txt');
			status.finish(new Error('Network down'));
			assert.deepEqual(stream.reports().at(-1), {
				state: 'error',
				app: 'box-cli',
				msg: 'box files:upload failed: Network down',
			});
		});

		it('should keep the failure message set by fail()', function () {
			const { status, stream } = createStatus();
			status.start();
			status.fail('Upload rejected');
			status.finish(new Error('raw error'));
			assert.equal(stream.reports().at(-1).msg, 'Upload rejected');
		});

		it('should finish idle when cancelled', function () {
			const { status, stream } = createStatus();
			status.start();
			status.cancel();
			status.finish();
			assert.deepEqual(stream.reports().at(-1), {
				state: 'idle',
				app: 'box-cli',
				msg: 'Cancelled box files:upload',
			});
		});

		it('should treat a successful oclif exit as done', function () {
			const { status, stream } = createStatus();
			status.start();
			const exitError = Object.assign(new Error('EEXIT: 0'), {
				code: 'EEXIT',
				oclif: { exit: 0 },
			});
			status.finish(exitError);
			assert.equal(stream.reports().at(-1).state, 'done');
		});

		it('should not write after finishing', function () {
			const { status, stream } = createStatus();
			status.start();
			status.finish();
			const count = stream.writes.length;
			status.working('Late work');
			status.finish();
			assert.lengthOf(stream.writes, count);
		});

		it('should never throw when the stream fails', function () {
			const status = new ProgramStatus({
				enabled: true,
				stream: {
					write() {
						throw new Error('EPIPE');
					},
				},
			});
			assert.doesNotThrow(() => {
				status.start();
				status.finish();
			});
		});

		it('should only listen for signals while running', function () {
			const sigintBefore = process.listenerCount('SIGINT');
			const sigtermBefore = process.listenerCount('SIGTERM');
			const { status } = createStatus();
			status.start();
			assert.equal(process.listenerCount('SIGINT'), sigintBefore + 1);
			assert.equal(process.listenerCount('SIGTERM'), sigtermBefore + 1);
			status.finish();
			assert.equal(process.listenerCount('SIGINT'), sigintBefore);
			assert.equal(process.listenerCount('SIGTERM'), sigtermBefore);
		});

		it('should not listen for signals when disabled', function () {
			const before = process.listenerCount('SIGINT');
			const { status } = createStatus({ enabled: false });
			status.start();
			assert.equal(process.listenerCount('SIGINT'), before);
		});

		it('should report idle when interrupted', function () {
			const otherHandler = sandbox.stub();
			process.on('SIGINT', otherHandler);
			const kill = sandbox.stub(process, 'kill');
			const { status, stream } = createStatus();
			try {
				status.start();
				process.emit('SIGINT', 'SIGINT');
			} finally {
				process.removeListener('SIGINT', otherHandler);
			}
			assert.deepEqual(stream.reports().at(-1), {
				state: 'idle',
				app: 'box-cli',
				msg: 'Cancelled box files:upload',
			});
			assert.isTrue(otherHandler.calledOnce);
			assert.isFalse(kill.called);
			status.finish();
			assert.equal(stream.reports().at(-1).state, 'idle');
		});

		it('should re-raise the signal when nothing else handles it', function () {
			const existingListeners = process.listeners('SIGTERM');
			process.removeAllListeners('SIGTERM');
			const kill = sandbox.stub(process, 'kill');
			const { status } = createStatus();
			try {
				status.start();
				process.emit('SIGTERM', 'SIGTERM');
			} finally {
				for (const listener of existingListeners) {
					process.on('SIGTERM', listener);
				}
			}
			assert.isTrue(kill.calledOnceWithExactly(process.pid, 'SIGTERM'));
		});
	});

	describe('BoxCommand prompts', function () {
		it('should report blocked for permission while confirming, then resume working', async function () {
			sandbox.stub(inquirer, 'prompt').resolves({ confirmation: true });
			const { command, stream } = createCommand();
			assert.isTrue(await command.confirm('Overwrite a.txt?'));
			assert.deepEqual(stream.reports().slice(1), [
				{
					state: 'blocked',
					kind: 'permission',
					app: 'box-cli',
					msg: 'Overwrite a.txt?',
				},
				{
					state: 'working',
					progress: '30',
					app: 'box-cli',
					msg: 'Downloading a.txt',
				},
			]);
		});

		it('should not report blocked when --yes skips the prompt', async function () {
			const prompt = sandbox.stub(inquirer, 'prompt');
			const { command, stream } = createCommand({ yes: true });
			assert.isTrue(await command.confirm('Overwrite a.txt?'));
			assert.isFalse(prompt.called);
			assert.lengthOf(stream.reports(), 1);
		});

		it('should finish idle when the user declines', async function () {
			sandbox.stub(inquirer, 'prompt').resolves({ confirmation: false });
			const { command, stream } = createCommand();
			await command.confirm('Overwrite a.txt?');
			command.programStatus.finish();
			assert.equal(stream.reports().at(-1).state, 'idle');
		});

		it('should not cancel the whole bulk run when one entry is declined', async function () {
			sandbox.stub(inquirer, 'prompt').resolves({ confirmation: false });
			const { command, stream } = createCommand({ isBulk: true });
			await command.confirm('Overwrite a.txt?');
			command.programStatus.finish();
			assert.equal(stream.reports().at(-1).state, 'done');
		});

		it('should resume working when a prompt fails', async function () {
			sandbox.stub(inquirer, 'prompt').rejects(new Error('closed'));
			const { command, stream } = createCommand();
			let error;
			try {
				await command.prompt([{ name: 'answer', message: 'Name?' }], {
					kind: 'question',
				});
			} catch (error_) {
				error = error_;
			}
			assert.equal(error.message, 'closed');
			assert.equal(stream.reports().at(-1).state, 'working');
		});

		it('should use a sanitized question message when no status message is given', async function () {
			sandbox.stub(inquirer, 'prompt').resolves({ answer: 'x' });
			const { command, stream } = createCommand();
			await command.prompt([
				{ name: 'answer', message: '\u001B[31mPick\u001B[39m\none' },
			]);
			assert.deepEqual(stream.reports()[1], {
				state: 'blocked',
				kind: 'question',
				app: 'box-cli',
				msg: 'Pick one',
			});
		});
	});

	describe('Command runs', function () {
		const bulkFilePath = path.join(
			os.tmpdir(),
			`box-cli-program-status-${process.pid}.json`
		);

		before(function () {
			fs.writeFileSync(
				bulkFilePath,
				JSON.stringify([{ id: '1' }, { id: '2' }, { id: '3' }])
			);
		});

		after(function () {
			fs.rmSync(bulkFilePath, { force: true });
		});

		test.env({ BOX_PROGRAM_STATUS: '1' })
			.nock(TEST_API_ROOT, (api) =>
				api.get('/2.0/users/me').reply(200, { type: 'user', id: '1' })
			)
			.stdout({ stripColor: false })
			.stderr({ stripColor: false })
			.command(['users:get', 'me', '--json', '--token=test'])
			.it(
				'should report working then done on stderr and keep stdout clean',
				(context) => {
					assert.notInclude(context.stdout, '\u001B]7501');
					assert.deepEqual(parseReports(context.stderr), [
						{
							state: 'working',
							app: 'box-cli',
							msg: 'Running box users:get',
						},
						{
							state: 'done',
							app: 'box-cli',
							msg: 'Finished box users:get',
						},
					]);
				}
			);

		test.env({ BOX_PROGRAM_STATUS: '1' })
			.nock(TEST_API_ROOT, (api) =>
				api.get('/2.0/users/me').reply(404, {
					type: 'error',
					status: 404,
					code: 'not_found',
					message: 'Not Found',
					request_id: 'abc',
				})
			)
			.stdout({ stripColor: false })
			.stderr({ stripColor: false })
			.command(['users:get', 'me', '--token=test'])
			.it('should report error when the command fails', (context) => {
				const reports = parseReports(context.stderr);
				assert.lengthOf(reports, 2);
				assert.equal(reports[1].state, 'error');
				assert.match(reports[1].msg, /^box users:get failed: .*404/u);
			});

		test.env({ BOX_PROGRAM_STATUS: '0' })
			.nock(TEST_API_ROOT, (api) =>
				api.get('/2.0/users/me').reply(200, { type: 'user', id: '1' })
			)
			.stdout({ stripColor: false })
			.stderr({ stripColor: false })
			.command(['users:get', 'me', '--token=test'])
			.it('should not report when turned off', (context) => {
				assert.notInclude(context.stderr, '\u001B]7501');
			});

		test.env({ BOX_PROGRAM_STATUS: '1' })
			.stdout({ stripColor: false })
			.stderr({ stripColor: false })
			.command(['users:get', '--help'])
			.it('should not report for help', (context) => {
				assert.notInclude(context.stderr, '\u001B]7501');
				assert.notInclude(context.stdout, '\u001B]7501');
			});

		test.env({ BOX_PROGRAM_STATUS: '1' })
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/users/1')
					.reply(200, { type: 'user', id: '1' })
					.get('/2.0/users/2')
					.reply(404, {
						type: 'error',
						status: 404,
						code: 'not_found',
						message: 'Not Found',
					})
					.get('/2.0/users/3')
					.reply(200, { type: 'user', id: '3' })
			)
			.stdout({ stripColor: false })
			.stderr({ stripColor: false })
			.command([
				'users:get',
				`--bulk-file-path=${bulkFilePath}`,
				'--json',
				'--token=test',
			])
			.it(
				'should report bulk progress and an error when an entry fails',
				(context) => {
					const reports = parseReports(context.stderr);
					assert.deepEqual(
						reports.map(({ state, progress }) => [state, progress]),
						[
							['working', undefined],
							['working', '0'],
							['working', '33'],
							['working', '66'],
							['working', '100'],
							['error', undefined],
						]
					);
					assert.equal(
						reports.at(-1).msg,
						'Bulk users:get: 1 of 3 entries failed'
					);
				}
			);
	});
});
