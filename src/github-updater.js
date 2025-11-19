'use strict';

const { ux } = require('@oclif/core');
const makeDebug = require('debug');
const { Updater } = require('@oclif/plugin-update/lib/update');

const debug = makeDebug('oclif:update:github');

let octokitInstance = null;

async function getOctokit() {
	if (!octokitInstance) {
		const { Octokit } = await import('@octokit/rest');
		octokitInstance = new Octokit({
			auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
		});
	}
	return octokitInstance;
}

function checkGitHubConfig(config) {
	const githubConfig = config.pjson.oclif.update?.github;

	if (
		githubConfig &&
		typeof githubConfig === 'object' &&
		'owner' in githubConfig &&
		'repo' in githubConfig
	) {
		return {
			owner: githubConfig.owner,
			repo: githubConfig.repo,
		};
	}

	// Try to parse from repository field
	const repo = config.pjson.repository;
	if (typeof repo === 'string') {
		// Handle formats like "owner/repo" or "github:owner/repo" or "https://github.com/owner/repo"
		const match =
			repo.match(/^(?:github:)?([^/]+)\/([^/]+?)(?:\.git)?$/u) ||
			repo.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?$/u);

		if (match) {
			return {
				owner: match[1],
				repo: match[2],
			};
		}
	}

	return null;
}

class GitHubUpdater extends Updater {
	constructor(config) {
		super(config);
		this.githubConfig = this.getGitHubConfig();
		this.octokit = null;
	}

	async ensureOctokit() {
		if (!this.octokit) {
			this.octokit = await getOctokit();
		}
	}

	// Override runUpdate to use GitHub-specific methods
	// Since the base class has private methods for fetching manifests,
	// we need to override the entire runUpdate to use GitHub APIs
	async runUpdate(options) {
		const { autoUpdate, version, force = false } = options;

		if (autoUpdate) {
			await this.debounce();
		}

		ux.action.start(`${this.config.name}: Updating CLI`);

		if (this.notUpdatable()) {
			ux.action.stop('not updatable');
			return;
		}

		const channel = 'stable';
		const current = await this.determineCurrentVersion();

		if (version) {
			const localVersion = force
				? null
				: await this.findLocalVersion(version);

			if (this.alreadyOnVersion(current, localVersion || null)) {
				ux.action.stop(
					this.config.scopedEnvVar('HIDE_UPDATED_MESSAGE')
						? 'done'
						: `already on version ${current}`
				);
				return;
			}

			await this.config.runHook('preupdate', { channel, version });

			if (localVersion) {
				await this.updateToExistingVersion(current, localVersion);
			} else {
				const index = await this.fetchVersionIndex();
				const url = index[version];
				if (!url) {
					throw new Error(
						`${version} not found in index:\n${Object.keys(index).join(', ')}`
					);
				}

				const manifest = await this.fetchGitHubManifest(version, url);
				const updated = manifest.sha
					? `${manifest.version}-${manifest.sha}`
					: manifest.version;
				await this.update(manifest, current, updated, force, channel);
			}

			await this.config.runHook('update', { channel, version });
			ux.action.stop();
			ux.stdout();
			ux.stdout(
				`Updating to a specific version will not update the channel. If autoupdate is enabled, the CLI will eventually be updated back to ${channel}.`
			);
		} else {
			const manifest = await this.fetchGitHubManifest();
			const updated = manifest.sha
				? `${manifest.version}-${manifest.sha}`
				: manifest.version;

			if (!force && this.alreadyOnVersion(current, updated)) {
				ux.action.stop(
					this.config.scopedEnvVar('HIDE_UPDATED_MESSAGE')
						? 'done'
						: `already on version ${current}`
				);
			} else {
				await this.config.runHook('preupdate', {
					channel,
					version: updated,
				});
				await this.update(manifest, current, updated, force, channel);
			}

			await this.config.runHook('update', { channel, version: updated });
			ux.action.stop();
		}

		await this.touch();
		await this.tidy();
	}

	// Override fetchVersionIndex to use GitHub releases
	async fetchVersionIndex() {
		return this.fetchGitHubVersionIndex();
	}

	// GitHub-specific implementation
	async fetchGitHubVersionIndex() {
		await this.ensureOctokit();
		ux.action.status = 'fetching version index from GitHub';

		const { owner, repo } = this.githubConfig;

		try {
			debug(`Fetching releases for ${owner}/${repo}`);
			const { data: releases } = await this.octokit.repos.listReleases({
				owner,
				per_page: 100,
				repo,
			});

			const versionIndex = {};

			for (const release of releases) {
				// Extract version from tag_name (remove 'v' prefix if present)
				const version = release.tag_name.replace(/^v/u, '');

				// Find the appropriate asset for this platform/arch
				const assetName = this.determineAssetName(version);
				const asset = release.assets.find((a) => a.name === assetName);

				if (asset) {
					versionIndex[version] = asset.browser_download_url;
				}
			}

			debug(`Found ${Object.keys(versionIndex).length} versions`);
			return versionIndex;
		} catch (error) {
			debug('Failed to fetch GitHub releases', error);
			throw new Error(
				`Failed to fetch releases from GitHub repository ${owner}/${repo}`
			);
		}
	}

	// GitHub-specific manifest fetching
	// Fetches latest release if no version specified, or specific version if provided
	async fetchGitHubManifest(version = null, fallbackUrl = null) {
		await this.ensureOctokit();
		ux.action.status = 'fetching manifest from GitHub';

		const { owner, repo } = this.githubConfig;

		try {
			let release;

			if (version) {
				debug(`Fetching release v${version} for ${owner}/${repo}`);
				const { data } = await this.octokit.repos.getReleaseByTag({
					owner,
					repo,
					tag: `v${version}`,
				});
				release = data;
			} else {
				debug(`Fetching latest release for ${owner}/${repo}`);
				const { data } = await this.octokit.repos.getLatestRelease({
					owner,
					repo,
				});
				release = data;
			}

			const releaseVersion = release.tag_name.replace(/^v/u, '');
			const assetName = this.determineAssetName(releaseVersion);
			const asset = release.assets.find((a) => a.name === assetName);

			if (!asset) {
				// If we have a fallback URL (for specific version), use it
				if (fallbackUrl) {
					return {
						gz: fallbackUrl,
						version: version || releaseVersion,
					};
				}

				// Otherwise, throw an error
				const config = this.config;
				throw new Error(
					`No suitable asset found for ${config.platform}-${config.arch} in release ${release.tag_name}`
				);
			}

			// Return manifest with the asset URL and SHA256 digest
			const manifest = {
				gz: asset.browser_download_url,
				version: releaseVersion,
			};

			// Add SHA256 digest if available (format: "sha256:hash")
			if (asset.digest) {
				const sha256Match = asset.digest.match(/^sha256:(.+)$/);
				if (sha256Match) {
					manifest.sha256gz = sha256Match[1];
				}
			}

			return manifest;
		} catch (error) {
			// If we have a fallback URL, use it
			if (fallbackUrl && version) {
				debug(
					'Failed to fetch version manifest, using fallback URL',
					error
				);
				return {
					gz: fallbackUrl,
					version,
				};
			}

			const statusCode = error.status;
			if (statusCode === 404) {
				throw new Error(
					version
						? `Release v${version} not found in ${owner}/${repo}`
						: `Release not found in ${owner}/${repo}`
				);
			}

			throw error;
		}
	}

	determineAssetName(version) {
		const config = this.config;
		const platform = config.platform === 'wsl' ? 'linux' : config.platform;
		const ext = config.windows ? 'tar.gz' : 'tar.gz';
		return `${config.bin}-v${version}-${platform}-${config.arch}.${ext}`;
	}

	getGitHubConfig() {
		const oclifConfig = this.config;
		const config = checkGitHubConfig(oclifConfig);
		if (!config) {
			throw new Error(
				'GitHub repository not configured. Add "oclif.update.github" with "owner" and "repo" fields to package.json'
			);
		}

		return config;
	}
}

module.exports = GitHubUpdater;
