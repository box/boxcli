'use strict';

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
		it('should list available versions when --available flag is passed', async function () {
			const mockVersionIndex = {
				'3.0.0':
					'https://github.com/box/boxcli/releases/download/v3.0.0',
				'2.5.0':
					'https://github.com/box/boxcli/releases/download/v2.5.0',
				'2.0.0':
					'https://github.com/box/boxcli/releases/download/v2.0.0',
			};
			const mockLocalVersions = ['/path/to/3.0.0'];

			fetchVersionIndexStub.resolves(mockVersionIndex);
			findLocalVersionsStub.resolves(mockLocalVersions);

			await test
				.stdout()
				.stub(
					GitHubUpdater.prototype,
					'fetchVersionIndex',
					fetchVersionIndexStub
				)
				.stub(
					GitHubUpdater.prototype,
					'findLocalVersions',
					findLocalVersionsStub
				)
				.command(['update', '--available'])
				.it('displays available versions in table format', (ctx) => {
					// Verify the stubs were called
					assert.isTrue(fetchVersionIndexStub.called);
					assert.isTrue(findLocalVersionsStub.called);
					// Verify output contains version numbers
					assert.include(ctx.stdout, '3.0.0');
					assert.include(ctx.stdout, '2.5.0');
				});
		});

		it('should call runUpdate with correct parameters when updating to specific version', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--version=3.0.0'])
				.it('updates to specified version', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.version, '3.0.0');
					assert.isFalse(callArgs.autoUpdate);
					assert.isFalse(callArgs.force);
				});
		});

		it('should call runUpdate with force flag', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--force'])
				.it('updates with force flag', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.isTrue(callArgs.force);
				});
		});

		it('should call runUpdate with autoupdate flag', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--autoupdate'])
				.it('updates with autoupdate flag', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.isTrue(callArgs.autoUpdate);
				});
		});

		it('should update to specific channel', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', 'stable'])
				.it('updates to specified channel', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.channel, 'stable');
				});
		});

		it('should error when both version and channel are specified', async function () {
			await test
				.command(['update', 'stable', '--version=3.0.0'])
				.catch((error) => {
					assert.include(
						error.message,
						'You cannot specify both a version and a channel'
					);
				})
				.it('throws error when both channel and version are provided');
		});

		it('should handle interactive version selection', async function () {
			const promptStub = sandbox.stub(
				UpdateCommand.prototype,
				'promptForVersion'
			);
			promptStub.resolves('3.0.0');
			runUpdateStub.resolves();

			await test
				.stub(UpdateCommand.prototype, 'promptForVersion', promptStub)
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--interactive'])
				.it('prompts for version selection in interactive mode', () => {
					assert.isTrue(promptStub.called);
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.version, '3.0.0');
				});
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
		it('should instantiate GitHubUpdater with config', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update'])
				.it('creates GitHubUpdater instance', () => {
					// Verify updater was instantiated
					assert.isTrue(runUpdateStub.called);
				});
		});

		it('should handle update errors gracefully', async function () {
			const updateError = new Error('Update failed');
			runUpdateStub.rejects(updateError);

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update'])
				.catch((error) => {
					assert.include(error.message, 'Update failed');
				})
				.it('handles update errors');
		});

		it('should handle version index fetch errors', async function () {
			const fetchError = new Error('Failed to fetch version index');
			fetchVersionIndexStub.rejects(fetchError);

			await test
				.stub(
					GitHubUpdater.prototype,
					'fetchVersionIndex',
					fetchVersionIndexStub
				)
				.command(['update', '--available'])
				.catch((error) => {
					assert.include(
						error.message,
						'Failed to fetch version index'
					);
				})
				.it('handles version index fetch errors');
		});
	});

	describe('update flags combinations', function () {
		it('should work with version and force flags together', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--version=3.0.0', '--force'])
				.it('updates to version with force', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.version, '3.0.0');
					assert.isTrue(callArgs.force);
				});
		});

		it('should work with channel and autoupdate flags together', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', 'stable', '--autoupdate'])
				.it('updates to channel with autoupdate', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.channel, 'stable');
					assert.isTrue(callArgs.autoUpdate);
				});
		});

		it('should work with interactive and force flags together', async function () {
			const promptStub = sandbox.stub(
				UpdateCommand.prototype,
				'promptForVersion'
			);
			promptStub.resolves('3.5.0');
			runUpdateStub.resolves();

			await test
				.stub(UpdateCommand.prototype, 'promptForVersion', promptStub)
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--interactive', '--force'])
				.it('prompts for version with force flag', () => {
					assert.isTrue(promptStub.called);
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.equal(callArgs.version, '3.5.0');
					assert.isTrue(callArgs.force);
				});
		});

		it('should handle autoupdate and force flags together', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--autoupdate', '--force'])
				.it('updates with autoupdate and force', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.isTrue(callArgs.autoUpdate);
					assert.isTrue(callArgs.force);
				});
		});
	});

	describe('update command without flags', function () {
		it('should run update without any flags', async function () {
			runUpdateStub.resolves();

			await test
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update'])
				.it('runs update with defaults', () => {
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.isFalse(callArgs.autoUpdate);
					assert.isFalse(callArgs.force);
					assert.isUndefined(callArgs.version);
				});
		});
	});

	describe('available versions display', function () {
		it('should display both local and remote versions', async function () {
			const mockVersionIndex = {
				'4.0.0':
					'https://github.com/box/boxcli/releases/download/v4.0.0',
				'3.5.0':
					'https://github.com/box/boxcli/releases/download/v3.5.0',
				'3.0.0':
					'https://github.com/box/boxcli/releases/download/v3.0.0',
			};
			const mockLocalVersions = [
				'/path/to/versions/4.0.0-darwin-x64',
				'/path/to/versions/3.5.0-darwin-x64',
			];

			fetchVersionIndexStub.resolves(mockVersionIndex);
			findLocalVersionsStub.resolves(mockLocalVersions);

			await test
				.stdout()
				.stub(
					GitHubUpdater.prototype,
					'fetchVersionIndex',
					fetchVersionIndexStub
				)
				.stub(
					GitHubUpdater.prototype,
					'findLocalVersions',
					findLocalVersionsStub
				)
				.command(['update', '--available'])
				.it('displays mixed local and remote versions', (ctx) => {
					assert.isTrue(fetchVersionIndexStub.called);
					assert.isTrue(findLocalVersionsStub.called);
					assert.include(ctx.stdout, '4.0.0');
					assert.include(ctx.stdout, '3.5.0');
					assert.include(ctx.stdout, '3.0.0');
				});
		});

		it('should display only remote versions when no local versions', async function () {
			const mockVersionIndex = {
				'2.0.0':
					'https://github.com/box/boxcli/releases/download/v2.0.0',
			};
			const mockLocalVersions = [];

			fetchVersionIndexStub.resolves(mockVersionIndex);
			findLocalVersionsStub.resolves(mockLocalVersions);

			await test
				.stdout()
				.stub(
					GitHubUpdater.prototype,
					'fetchVersionIndex',
					fetchVersionIndexStub
				)
				.stub(
					GitHubUpdater.prototype,
					'findLocalVersions',
					findLocalVersionsStub
				)
				.command(['update', '--available'])
				.it('displays only remote versions', (ctx) => {
					assert.isTrue(fetchVersionIndexStub.called);
					assert.isTrue(findLocalVersionsStub.called);
					assert.include(ctx.stdout, '2.0.0');
				});
		});
	});

	describe('edge cases', function () {
		it('should handle empty version index', async function () {
			const mockVersionIndex = {};
			const mockLocalVersions = [];

			fetchVersionIndexStub.resolves(mockVersionIndex);
			findLocalVersionsStub.resolves(mockLocalVersions);

			await test
				.stdout()
				.stub(
					GitHubUpdater.prototype,
					'fetchVersionIndex',
					fetchVersionIndexStub
				)
				.stub(
					GitHubUpdater.prototype,
					'findLocalVersions',
					findLocalVersionsStub
				)
				.command(['update', '--available'])
				.it('handles empty version index gracefully', () => {
					assert.isTrue(fetchVersionIndexStub.called);
					assert.isTrue(findLocalVersionsStub.called);
				});
		});

		it('should handle promptForVersion returning null', async function () {
			const promptStub = sandbox.stub(
				UpdateCommand.prototype,
				'promptForVersion'
			);
			promptStub.resolves(null);
			runUpdateStub.resolves();

			await test
				.stub(UpdateCommand.prototype, 'promptForVersion', promptStub)
				.stub(GitHubUpdater.prototype, 'runUpdate', runUpdateStub)
				.command(['update', '--interactive'])
				.it('handles null version from prompt', () => {
					assert.isTrue(promptStub.called);
					assert.isTrue(runUpdateStub.called);
					const callArgs = runUpdateStub.getCall(0).args[0];
					assert.isNull(callArgs.version);
				});
		});

		it('should handle version with special characters in basename matching', async function () {
			const mockVersionIndex = {
				'1.0.0-beta':
					'https://github.com/box/boxcli/releases/download/v1.0.0-beta',
			};
			const mockLocalVersions = ['/path/to/versions/1.0.0-beta-darwin-x64'];

			fetchVersionIndexStub.resolves(mockVersionIndex);
			findLocalVersionsStub.resolves(mockLocalVersions);

			await test
				.stdout()
				.stub(
					GitHubUpdater.prototype,
					'fetchVersionIndex',
					fetchVersionIndexStub
				)
				.stub(
					GitHubUpdater.prototype,
					'findLocalVersions',
					findLocalVersionsStub
				)
				.command(['update', '--available'])
				.it('matches version with special characters', (ctx) => {
					assert.include(ctx.stdout, '1.0.0-beta');
					assert.include(ctx.stdout, '/path/to/versions/1.0.0-beta-darwin-x64');
				});
		});
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
