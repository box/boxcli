'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const GitHubUpdater = require('../src/github-updater');

// Helper function to create a mock config with required methods
function createMockConfig(overrides = {}) {
	return {
		scopedEnvVar: sinon.stub().returns(),
		scopedEnvVarKey: sinon.stub().returns('TEST_VAR'),
		s3Key: sinon.stub().returns('test-key'),
		cacheDir: '/tmp/cache',
		dataDir: '/tmp/data',
		root: '/tmp/root',
		name: 'boxcli',
		version: '1.0.0',
		bin: 'box',
		platform: 'darwin',
		arch: 'x64',
		...overrides,
	};
}

describe('GitHubUpdater', function () {
	let sandbox;

	beforeEach(function () {
		sandbox = sinon.createSandbox();
	});

	afterEach(function () {
		sandbox.restore();
	});

	describe('getGitHubConfig', function () {
		it('should return owner and repo from oclif.update.github config', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should parse owner and repo from repository string (owner/repo format)', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
					repository: 'box/boxcli',
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should parse owner and repo from repository string (github: prefix)', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
					repository: 'github:box/boxcli',
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should parse owner and repo from repository string (.git suffix)', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
					repository: 'box/boxcli.git',
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should parse owner and repo from repository URL', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
					repository: 'https://github.com/box/boxcli',
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should parse owner and repo from repository URL with .git suffix', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
					repository: 'https://github.com/box/boxcli.git',
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should throw error when GitHub config is not found', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
				},
			});

			assert.throws(() => {
				new GitHubUpdater(mockConfig);
			}, /GitHub repository not configured/);
		});

		it('should throw error when repository is not a GitHub URL', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {},
					repository: 'https://gitlab.com/box/boxcli',
				},
			});

			assert.throws(() => {
				new GitHubUpdater(mockConfig);
			}, /GitHub repository not configured/);
		});

		it('should prioritize oclif.update.github over repository field', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
					repository: 'other/repo',
				},
			});

			const updater = new GitHubUpdater(mockConfig);
			const config = updater.getGitHubConfig();

			assert.deepEqual(config, {
				owner: 'box',
				repo: 'boxcli',
			});
		});

		it('should throw error when github config is incomplete (missing repo)', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
							},
						},
					},
				},
			});

			assert.throws(() => {
				new GitHubUpdater(mockConfig);
			}, /GitHub repository not configured/);
		});

		it('should throw error when github config is incomplete (missing owner)', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								repo: 'boxcli',
							},
						},
					},
				},
			});

			assert.throws(() => {
				new GitHubUpdater(mockConfig);
			}, /GitHub repository not configured/);
		});
	});

	describe('determineAssetName', function () {
		it('should generate correct asset name for darwin platform', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'box',
				platform: 'darwin',
				arch: 'x64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('1.0.0');

			assert.equal(assetName, 'box-v1.0.0-darwin-x64.tar.gz');
		});

		it('should generate correct asset name for linux platform', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'box',
				platform: 'linux',
				arch: 'x64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('2.5.0');

			assert.equal(assetName, 'box-v2.5.0-linux-x64.tar.gz');
		});

		it('should generate correct asset name for windows platform', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'box',
				platform: 'win32',
				arch: 'x64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('3.0.0');

			assert.equal(assetName, 'box-v3.0.0-win32-x64.tar.gz');
		});

		it('should convert wsl platform to linux', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'box',
				platform: 'wsl',
				arch: 'x64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('1.0.0');

			assert.equal(assetName, 'box-v1.0.0-linux-x64.tar.gz');
		});

		it('should generate correct asset name for arm64 architecture', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'box',
				platform: 'darwin',
				arch: 'arm64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('1.5.0');

			assert.equal(assetName, 'box-v1.5.0-darwin-arm64.tar.gz');
		});

		it('should use custom bin name in asset', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'customcli',
				platform: 'darwin',
				arch: 'x64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('2.0.0');

			assert.equal(assetName, 'customcli-v2.0.0-darwin-x64.tar.gz');
		});

		it('should generate correct asset name for linux arm64', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
				bin: 'box',
				platform: 'linux',
				arch: 'arm64',
			});

			const updater = new GitHubUpdater(mockConfig);
			const assetName = updater.determineAssetName('3.2.1');

			assert.equal(assetName, 'box-v3.2.1-linux-arm64.tar.gz');
		});
	});

	describe('constructor', function () {
		it('should initialize with null octokit', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
			});

			const updater = new GitHubUpdater(mockConfig);

			assert.isNull(updater.octokit);
			assert.exists(updater.githubConfig);
		});

		it('should store githubConfig from getGitHubConfig', function () {
			const mockConfig = createMockConfig({
				pjson: {
					oclif: {
						update: {
							github: {
								owner: 'box',
								repo: 'boxcli',
							},
						},
					},
				},
			});

			const updater = new GitHubUpdater(mockConfig);

			assert.deepEqual(updater.githubConfig, {
				owner: 'box',
				repo: 'boxcli',
			});
		});
	});
});
