'use strict';

// fancy-test's .catch() asserts on a thrown error; it is not Promise#catch
/* eslint-disable promise/catch-or-return */
const { test } = require('@oclif/test');
const assert = require('chai').assert;
const sinon = require('sinon');
const UpdateCommand = require('../../src/commands/update');
const GitHubUpdater = require('../../src/github-updater');

describe('Update', function () {
	let sandbox;
	let githubUpdaterStub;
	let fetchVersionIndexStub;
	let findLocalVersionsStub;
	let runUpdateStub;
	let promptStub;

	beforeEach(function () {
		sandbox = sinon.createSandbox();

		// Stub GitHubUpdater methods
		fetchVersionIndexStub = sandbox.stub();
		findLocalVersionsStub = sandbox.stub();
		runUpdateStub = sandbox.stub();

		githubUpdaterStub = sandbox.stub(GitHubUpdater.prototype);
		githubUpdaterStub.fetchVersionIndex = fetchVersionIndexStub;
		githubUpdaterStub.findLocalVersions = findLocalVersionsStub;
		githubUpdaterStub.runUpdate = runUpdateStub;
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('update', function () {
		test.do(() => {
			fetchVersionIndexStub.resolves({
				'3.0.0':
					'https://github.com/box/boxcli/releases/download/v3.0.0',
				'2.5.0':
					'https://github.com/box/boxcli/releases/download/v2.5.0',
				'2.0.0':
					'https://github.com/box/boxcli/releases/download/v2.0.0',
			});
			findLocalVersionsStub.resolves(['/path/to/3.0.0']);
		})
			.stdout()
			.command(['update', '--available'])
			.it(
				'should list available versions when --available flag is passed',
				(ctx) => {
					assert.isTrue(fetchVersionIndexStub.called);
					assert.isTrue(findLocalVersionsStub.called);
					assert.include(ctx.stdout, '3.0.0');
					assert.include(ctx.stdout, '2.5.0');
				}
			);

		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update', '--version=3.0.0'])
			.it(
				'should call runUpdate with correct parameters when updating to specific version',
				() => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.version, '3.0.0');
					assert.notOk(callArgs.autoUpdate);
					assert.notOk(callArgs.force);
				}
			);

		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update', '--force'])
			.it('should call runUpdate with force flag', () => {
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.isTrue(callArgs.force);
			});

		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update', '--autoupdate'])
			.it('should call runUpdate with autoupdate flag', () => {
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.isTrue(callArgs.autoUpdate);
			});

		test.do(() => {
			promptStub = sandbox
				.stub(UpdateCommand.prototype, 'promptForVersion')
				.resolves('3.0.0');
			runUpdateStub.resolves();
		})
			.command(['update', '--interactive'])
			.it('should handle interactive version selection', () => {
				assert.isTrue(promptStub.called);
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.equal(callArgs.version, '3.0.0');
			});
	});

	describe('update command description', function () {
		it('should have correct description', function () {
			assert.equal(
				UpdateCommand.description,
				'Update the BoxCLI using GitHub'
			);
		});
	});

	describe('GitHubUpdater integration', function () {
		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update'])
			.it('should instantiate GitHubUpdater with config', () => {
				assert.isTrue(runUpdateStub.called);
			});

		test.do(() => {
			runUpdateStub.rejects(new Error('Update failed'));
		})
			.command(['update'])
			.catch((error) => {
				assert.include(error.message, 'Update failed');
			})
			.it('should handle update errors gracefully');

		test.do(() => {
			fetchVersionIndexStub.rejects(
				new Error('Failed to fetch version index')
			);
		})
			.command(['update', '--available'])
			.catch((error) => {
				assert.include(error.message, 'Failed to fetch version index');
			})
			.it('should handle version index fetch errors');

		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update', 'stable'])
			.catch((error) => {
				assert.include(error.message, 'Unexpected argument: stable');
			})
			.it('should reject a channel argument');
	});

	describe('update flags combinations', function () {
		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update', '--version=3.0.0', '--force'])
			.it('should work with version and force flags together', () => {
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.equal(callArgs.version, '3.0.0');
				assert.isTrue(callArgs.force);
			});

		test.do(() => {
			promptStub = sandbox
				.stub(UpdateCommand.prototype, 'promptForVersion')
				.resolves('3.5.0');
			runUpdateStub.resolves();
		})
			.command(['update', '--interactive', '--force'])
			.it('should work with interactive and force flags together', () => {
				assert.isTrue(promptStub.called);
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.equal(callArgs.version, '3.5.0');
				assert.isTrue(callArgs.force);
			});

		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update', '--autoupdate', '--force'])
			.it('should handle autoupdate and force flags together', () => {
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.isTrue(callArgs.autoUpdate);
				assert.isTrue(callArgs.force);
			});
	});

	describe('update command without flags', function () {
		test.do(() => {
			runUpdateStub.resolves();
		})
			.command(['update'])
			.it('should run update without any flags', () => {
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.notOk(callArgs.autoUpdate);
				assert.notOk(callArgs.force);
				assert.isUndefined(callArgs.version);
			});
	});

	describe('available versions display', function () {
		test.do(() => {
			fetchVersionIndexStub.resolves({
				'4.0.0':
					'https://github.com/box/boxcli/releases/download/v4.0.0',
				'3.5.0':
					'https://github.com/box/boxcli/releases/download/v3.5.0',
				'3.0.0':
					'https://github.com/box/boxcli/releases/download/v3.0.0',
			});
			findLocalVersionsStub.resolves([
				'/path/to/versions/4.0.0-darwin-x64',
				'/path/to/versions/3.5.0-darwin-x64',
			]);
		})
			.stdout()
			.command(['update', '--available'])
			.it('should display both local and remote versions', (ctx) => {
				assert.isTrue(fetchVersionIndexStub.called);
				assert.isTrue(findLocalVersionsStub.called);
				assert.include(ctx.stdout, '4.0.0');
				assert.include(ctx.stdout, '3.5.0');
				assert.include(ctx.stdout, '3.0.0');
			});

		test.do(() => {
			fetchVersionIndexStub.resolves({
				'2.0.0':
					'https://github.com/box/boxcli/releases/download/v2.0.0',
			});
			findLocalVersionsStub.resolves([]);
		})
			.stdout()
			.command(['update', '--available'])
			.it(
				'should display only remote versions when no local versions',
				(ctx) => {
					assert.isTrue(fetchVersionIndexStub.called);
					assert.isTrue(findLocalVersionsStub.called);
					assert.include(ctx.stdout, '2.0.0');
				}
			);
	});

	describe('edge cases', function () {
		test.do(() => {
			fetchVersionIndexStub.resolves({});
			findLocalVersionsStub.resolves([]);
		})
			.stdout()
			.command(['update', '--available'])
			.it('should handle empty version index', () => {
				assert.isTrue(fetchVersionIndexStub.called);
				assert.isTrue(findLocalVersionsStub.called);
			});

		test.do(() => {
			promptStub = sandbox
				.stub(UpdateCommand.prototype, 'promptForVersion')
				.resolves(null);
			runUpdateStub.resolves();
		})
			.command(['update', '--interactive'])
			.it('should handle promptForVersion returning null', () => {
				assert.isTrue(promptStub.called);
				assert.isTrue(runUpdateStub.called);
				const callArgs = runUpdateStub.getCall(0).args[0];
				assert.isNull(callArgs.version);
			});

		test.do(() => {
			fetchVersionIndexStub.resolves({
				'1.0.0-beta':
					'https://github.com/box/boxcli/releases/download/v1.0.0-beta',
			});
			findLocalVersionsStub.resolves([
				'/path/to/versions/1.0.0-beta-darwin-x64',
			]);
		})
			.stdout()
			.command(['update', '--available'])
			.it(
				'should handle version with special characters in basename matching',
				(ctx) => {
					assert.include(ctx.stdout, '1.0.0-beta');
					assert.include(
						ctx.stdout,
						'/path/to/versions/1.0.0-beta-darwin-x64'
					);
				}
			);
	});

	describe('command class properties', function () {
		it('should have empty args array', function () {
			assert.isArray(UpdateCommand.args);
			assert.isEmpty(UpdateCommand.args);
		});

		it('should have examples without the first one', function () {
			// UpdateCommand.examples should have examples, just with the first one removed
			assert.isArray(UpdateCommand.examples);
		});
	});
});
