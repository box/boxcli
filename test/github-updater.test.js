'use strict';

const assert = require('chai').assert;
const sinon = require('sinon');
const GitHubUpdater = require('../src/github-updater');
const fs = require('node:fs');
const path = require('node:path');

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

	describe('GitHub API Integration Tests', function () {
		let mockReleaseData;

		beforeEach(function () {
			// Load the real GitHub API response
			const fixtureData = fs.readFileSync(
				path.join(__dirname, 'fixtures/github/releases-v4.4.1.json'),
				'utf8'
			);
			mockReleaseData = JSON.parse(fixtureData);
		});

		describe('fetchGitHubVersionIndex', function () {
			it('should parse GitHub releases and create version index', async function () {
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

				// Mock the Octokit API
				const mockOctokit = {
					repos: {
						listReleases: sinon
							.stub()
							.resolves({ data: mockReleaseData }),
					},
				};
				updater.octokit = mockOctokit;

				const versionIndex = await updater.fetchGitHubVersionIndex();

				assert.isObject(versionIndex);
				assert.property(versionIndex, '4.4.1');
				assert.equal(
					versionIndex['4.4.1'],
					'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-darwin-x64.tar.gz'
				);
			});

			it('should find correct asset for darwin arm64', async function () {
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

				const mockOctokit = {
					repos: {
						listReleases: sinon
							.stub()
							.resolves({ data: mockReleaseData }),
					},
				};
				updater.octokit = mockOctokit;

				const versionIndex = await updater.fetchGitHubVersionIndex();

				assert.equal(
					versionIndex['4.4.1'],
					'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-darwin-arm64.tar.gz'
				);
			});

			it('should find correct asset for windows x64', async function () {
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

				const mockOctokit = {
					repos: {
						listReleases: sinon
							.stub()
							.resolves({ data: mockReleaseData }),
					},
				};
				updater.octokit = mockOctokit;

				const versionIndex = await updater.fetchGitHubVersionIndex();

				assert.equal(
					versionIndex['4.4.1'],
					'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-win32-x64.tar.gz'
				);
			});
		});

		describe('fetchGitHubManifest', function () {
			it('should fetch latest release manifest when no version specified', async function () {
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

				const mockOctokit = {
					repos: {
						getLatestRelease: sinon
							.stub()
							.resolves({ data: mockReleaseData[0] }),
					},
				};
				updater.octokit = mockOctokit;

				const manifest = await updater.fetchGitHubManifest();

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.equal(
					manifest.gz,
					'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-darwin-x64.tar.gz'
				);
				assert.equal(
					manifest.sha256gz,
					'8dac71613287363ffca3dcb7d84805142cb4d10878f03b4fcda3916d660138d2'
				);
			});

			it('should fetch correct asset for different architectures', async function () {
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

				const mockOctokit = {
					repos: {
						getLatestRelease: sinon
							.stub()
							.resolves({ data: mockReleaseData[0] }),
					},
				};
				updater.octokit = mockOctokit;

				const manifest = await updater.fetchGitHubManifest();

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.equal(
					manifest.gz,
					'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-darwin-arm64.tar.gz'
				);
				assert.equal(
					manifest.sha256gz,
					'716923f5a7c32f5344662eb10e2f10f9d89fb008e1d418b99cbcbe4247c1bc6f'
				);
			});

			it('should throw error when asset not found for platform', async function () {
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

				const mockOctokit = {
					repos: {
						getLatestRelease: sinon
							.stub()
							.resolves({ data: mockReleaseData[0] }),
					},
				};
				updater.octokit = mockOctokit;

				try {
					await updater.fetchGitHubManifest();
					assert.fail('Should have thrown an error');
				} catch (error) {
					assert.include(error.message, 'No suitable asset found');
					assert.include(error.message, 'linux-x64');
				}
			});

			it('should fetch specific version manifest when version provided', async function () {
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
					arch: 'arm64',
				});

				const updater = new GitHubUpdater(mockConfig);

				const mockOctokit = {
					repos: {
						getReleaseByTag: sinon
							.stub()
							.resolves({ data: mockReleaseData[0] }),
					},
				};
				updater.octokit = mockOctokit;

				const manifest = await updater.fetchGitHubManifest(
					'4.4.1',
					'https://fallback-url.com/asset.tar.gz'
				);

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.equal(
					manifest.gz,
					'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-win32-arm64.tar.gz'
				);
				assert.equal(
					manifest.sha256gz,
					'52b3e75426d0de2b0c4343e36ae125f1124cc748899675681957f0770647f301'
				);
			});

			it('should fallback to provided URL when asset not found', async function () {
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

				const mockOctokit = {
					repos: {
						getReleaseByTag: sinon
							.stub()
							.resolves({ data: mockReleaseData[0] }),
					},
				};
				updater.octokit = mockOctokit;

				const fallbackUrl =
					'https://fallback-url.com/box-v4.4.1.tar.gz';
				const manifest = await updater.fetchGitHubManifest(
					'4.4.1',
					fallbackUrl
				);

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.equal(manifest.gz, fallbackUrl);
			});

			it('should fallback to provided URL on API error', async function () {
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

				const mockOctokit = {
					repos: {
						getReleaseByTag: sinon
							.stub()
							.rejects(new Error('API Error')),
					},
				};
				updater.octokit = mockOctokit;

				const fallbackUrl =
					'https://fallback-url.com/box-v4.4.1.tar.gz';
				const manifest = await updater.fetchGitHubManifest(
					'4.4.1',
					fallbackUrl
				);

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.equal(manifest.gz, fallbackUrl);
			});

			it('should throw error with 404 status when release not found', async function () {
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

				const notFoundError = new Error('Not Found');
				notFoundError.status = 404;

				const mockOctokit = {
					repos: {
						getReleaseByTag: sinon.stub().rejects(notFoundError),
					},
				};
				updater.octokit = mockOctokit;

				try {
					await updater.fetchGitHubManifest('99.99.99');
					assert.fail('Should have thrown an error');
				} catch (error) {
					assert.include(error.message, 'Release v99.99.99 not found');
					assert.include(error.message, 'box/boxcli');
				}
			});

			it('should throw error for 404 when fetching latest release', async function () {
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

				const notFoundError = new Error('Not Found');
				notFoundError.status = 404;

				const mockOctokit = {
					repos: {
						getLatestRelease: sinon.stub().rejects(notFoundError),
					},
				};
				updater.octokit = mockOctokit;

				try {
					await updater.fetchGitHubManifest();
					assert.fail('Should have thrown an error');
				} catch (error) {
					assert.include(error.message, 'Release not found in box/boxcli');
				}
			});

			it('should handle manifest without SHA256 digest', async function () {
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

				const releaseWithoutDigest = {
					...mockReleaseData[0],
					assets: mockReleaseData[0].assets.map((asset) => ({
						...asset,
						digest: undefined,
					})),
				};

				const mockOctokit = {
					repos: {
						getLatestRelease: sinon
							.stub()
							.resolves({ data: releaseWithoutDigest }),
					},
				};
				updater.octokit = mockOctokit;

				const manifest = await updater.fetchGitHubManifest();

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.isUndefined(manifest.sha256gz);
			});

			it('should handle manifest with invalid digest format', async function () {
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

				const releaseWithInvalidDigest = {
					...mockReleaseData[0],
					assets: mockReleaseData[0].assets.map((asset) =>
						asset.name === 'box-v4.4.1-darwin-x64.tar.gz'
							? {
									...asset,
									digest: 'md5:somehash',
							  }
							: asset
					),
				};

				const mockOctokit = {
					repos: {
						getLatestRelease: sinon
							.stub()
							.resolves({ data: releaseWithInvalidDigest }),
					},
				};
				updater.octokit = mockOctokit;

				const manifest = await updater.fetchGitHubManifest();

				assert.isObject(manifest);
				assert.equal(manifest.version, '4.4.1');
				assert.isUndefined(manifest.sha256gz);
			});
		});

		describe('fetchVersionIndex', function () {
			it('should delegate to fetchGitHubVersionIndex', async function () {
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

				const mockOctokit = {
					repos: {
						listReleases: sinon
							.stub()
							.resolves({ data: mockReleaseData }),
					},
				};
				updater.octokit = mockOctokit;

				const versionIndex = await updater.fetchVersionIndex();

				assert.isObject(versionIndex);
				assert.property(versionIndex, '4.4.1');
			});
		});

		describe('GitHub API error handling', function () {
			it('should throw error when GitHub API fails for version index', async function () {
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

				const mockOctokit = {
					repos: {
						listReleases: sinon
							.stub()
							.rejects(new Error('API Error')),
					},
				};
				updater.octokit = mockOctokit;

				try {
					await updater.fetchGitHubVersionIndex();
					assert.fail('Should have thrown an error');
				} catch (error) {
					assert.include(
						error.message,
						'Failed to fetch releases from GitHub repository box/boxcli'
					);
				}
			});

			it('should handle empty releases list', async function () {
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

				const mockOctokit = {
					repos: {
						listReleases: sinon.stub().resolves({ data: [] }),
					},
				};
				updater.octokit = mockOctokit;

				const versionIndex = await updater.fetchGitHubVersionIndex();

				assert.isObject(versionIndex);
				assert.isEmpty(versionIndex);
			});
		});
	});

	describe('ensureOctokit', function () {
		it('should initialize octokit if not already initialized', async function () {
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

			await updater.ensureOctokit();

			assert.isNotNull(updater.octokit);
		});

		it('should not reinitialize octokit if already set', async function () {
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
			const mockOctokit = { repos: {} };
			updater.octokit = mockOctokit;

			await updater.ensureOctokit();

			assert.strictEqual(updater.octokit, mockOctokit);
		});
	});

	describe('runUpdate', function () {
		let mockConfig;
		let updater;
		let mockOctokit;
		let uxActionStartStub;
		let uxActionStopStub;

		beforeEach(function () {
			mockConfig = createMockConfig({
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
				runHook: sinon.stub().resolves(),
			});

			updater = new GitHubUpdater(mockConfig);

			mockOctokit = {
				repos: {
					getLatestRelease: sinon.stub().resolves({ data: {} }),
					getReleaseByTag: sinon.stub().resolves({ data: {} }),
				},
			};
			updater.octokit = mockOctokit;

			// Stub ux methods
			const { ux } = require('@oclif/core');
			uxActionStartStub = sandbox.stub(ux.action, 'start');
			uxActionStopStub = sandbox.stub(ux.action, 'stop');
		});

		it('should stop early if not updatable', async function () {
			sandbox.stub(updater, 'notUpdatable').returns(true);

			await updater.runUpdate({ autoUpdate: false, force: false });

			assert.isTrue(uxActionStartStub.called);
			assert.isTrue(uxActionStopStub.calledWith('not updatable'));
		});

		it('should debounce when autoUpdate is true', async function () {
			const debounceStub = sandbox.stub(updater, 'debounce').resolves();
			sandbox.stub(updater, 'notUpdatable').returns(true);

			await updater.runUpdate({ autoUpdate: true, force: false });

			assert.isTrue(debounceStub.called);
		});

		it('should skip update if already on version', async function () {
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
				version: '4.4.1',
				runHook: sinon.stub().resolves(),
			});

			const updater = new GitHubUpdater(mockConfig);
			updater.octokit = mockOctokit;

			sandbox.stub(updater, 'notUpdatable').returns(false);
			sandbox.stub(updater, 'determineCurrentVersion').resolves('4.4.1');
			sandbox.stub(updater, 'alreadyOnVersion').returns(true);

			const fixtureData = fs.readFileSync(
				path.join(__dirname, 'fixtures/github/releases-v4.4.1.json'),
				'utf8'
			);
			const mockReleaseData = JSON.parse(fixtureData);

			mockOctokit.repos.getLatestRelease = sinon
				.stub()
				.resolves({ data: mockReleaseData[0] });

			await updater.runUpdate({ autoUpdate: false, force: false });

			assert.isTrue(
				uxActionStopStub.calledWith(sinon.match(/already on version/))
			);
		});

		it('should update to specific version with force flag', async function () {
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
				version: '4.4.0',
				runHook: sinon.stub().resolves(),
			});

			const updater = new GitHubUpdater(mockConfig);
			updater.octokit = mockOctokit;

			sandbox.stub(updater, 'notUpdatable').returns(false);
			sandbox.stub(updater, 'determineCurrentVersion').resolves('4.4.0');
			sandbox.stub(updater, 'alreadyOnVersion').returns(false);
			sandbox.stub(updater, 'findLocalVersion').resolves(null);
			sandbox.stub(updater, 'update').resolves();
			sandbox.stub(updater, 'touch').resolves();
			sandbox.stub(updater, 'tidy').resolves();

			const fixtureData = fs.readFileSync(
				path.join(__dirname, 'fixtures/github/releases-v4.4.1.json'),
				'utf8'
			);
			const mockReleaseData = JSON.parse(fixtureData);

			const fetchVersionIndexStub = sandbox
				.stub(updater, 'fetchVersionIndex')
				.resolves({
					'4.4.1':
						'https://github.com/box/boxcli/releases/download/v4.4.1/box-v4.4.1-darwin-x64.tar.gz',
				});

			mockOctokit.repos.getReleaseByTag = sinon
				.stub()
				.resolves({ data: mockReleaseData[0] });

			await updater.runUpdate({
				autoUpdate: false,
				force: true,
				version: '4.4.1',
			});

			assert.isTrue(fetchVersionIndexStub.called);
			assert.isTrue(mockConfig.runHook.calledWith('preupdate'));
			assert.isTrue(mockConfig.runHook.calledWith('update'));
		});

		it('should update to existing local version', async function () {
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
				version: '4.4.0',
				runHook: sinon.stub().resolves(),
			});

			const updater = new GitHubUpdater(mockConfig);
			updater.octokit = mockOctokit;

			sandbox.stub(updater, 'notUpdatable').returns(false);
			sandbox.stub(updater, 'determineCurrentVersion').resolves('4.4.0');
			sandbox.stub(updater, 'alreadyOnVersion').returns(false);
			sandbox
				.stub(updater, 'findLocalVersion')
				.resolves('/path/to/local/4.4.1');
			sandbox.stub(updater, 'updateToExistingVersion').resolves();
			sandbox.stub(updater, 'touch').resolves();
			sandbox.stub(updater, 'tidy').resolves();

			await updater.runUpdate({
				autoUpdate: false,
				force: false,
				version: '4.4.1',
			});

			assert.isTrue(mockConfig.runHook.calledWith('preupdate'));
			assert.isTrue(mockConfig.runHook.calledWith('update'));
		});

		it('should throw error when version not found in index', async function () {
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
				version: '4.4.0',
				runHook: sinon.stub().resolves(),
			});

			const updater = new GitHubUpdater(mockConfig);
			updater.octokit = mockOctokit;

			sandbox.stub(updater, 'notUpdatable').returns(false);
			sandbox.stub(updater, 'determineCurrentVersion').resolves('4.4.0');
			sandbox.stub(updater, 'alreadyOnVersion').returns(false);
			sandbox.stub(updater, 'findLocalVersion').resolves(null);
			sandbox.stub(updater, 'fetchVersionIndex').resolves({
				'4.4.1':
					'https://github.com/box/boxcli/releases/download/v4.4.1',
			});

			try {
				await updater.runUpdate({
					autoUpdate: false,
					force: false,
					version: '99.99.99',
				});
				assert.fail('Should have thrown an error');
			} catch (error) {
				assert.include(error.message, '99.99.99 not found in index');
			}
		});

		it('should use HIDE_UPDATED_MESSAGE env var when already on version', async function () {
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
				version: '4.4.1',
				runHook: sinon.stub().resolves(),
			});

			mockConfig.scopedEnvVar = sinon
				.stub()
				.withArgs('HIDE_UPDATED_MESSAGE')
				.returns('true');

			const updater = new GitHubUpdater(mockConfig);
			updater.octokit = mockOctokit;

			sandbox.stub(updater, 'notUpdatable').returns(false);
			sandbox.stub(updater, 'determineCurrentVersion').resolves('4.4.1');
			sandbox.stub(updater, 'alreadyOnVersion').returns(true);

			const fixtureData = fs.readFileSync(
				path.join(__dirname, 'fixtures/github/releases-v4.4.1.json'),
				'utf8'
			);
			const mockReleaseData = JSON.parse(fixtureData);

			mockOctokit.repos.getLatestRelease = sinon
				.stub()
				.resolves({ data: mockReleaseData[0] });

			await updater.runUpdate({ autoUpdate: false, force: false });

			assert.isTrue(uxActionStopStub.calledWith('done'));
		});
	});
});
