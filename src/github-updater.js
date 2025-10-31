'use strict';

const { ux } = require('@oclif/core');
const makeDebug = require('debug');
const { Updater } = require('@oclif/plugin-update/lib/update');

const debug = makeDebug('oclif:update:github');

let octokitInstance = null;
let octokitClass = null;
let gotModule = null;

async function loadOctokit() {
	if (!octokitClass) {
		const { Octokit } = await import('@octokit/rest');
		octokitClass = Octokit;
	}
	return octokitClass;
}

async function loadGot() {
	if (!gotModule) {
		const module = await import('got');
		gotModule = module.default || module;
	}

	return gotModule;
}

async function getOctokit() {
	if (!octokitInstance) {
		octokitClass = await loadOctokit();
		return new octokitClass({
			auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
		});
	}
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

		const channel = options.channel || (await this.determineChannel(version));
		const current = await this.determineCurrentVersion();

		if (version) {
			const localVersion = force ? null : await this.findLocalVersion(version);

			if (this.alreadyOnVersion(current, localVersion || null)) {
				ux.action.stop(
					this.config.scopedEnvVar('HIDE_UPDATED_MESSAGE')
						? 'done'
						: `already on version ${current}`,
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
						`${version} not found in index:\n${Object.keys(index).join(', ')}`,
					);
				}

				const manifest = await this.fetchGitHubVersionManifest(version, url);
				const updated = manifest.sha
					? `${manifest.version}-${manifest.sha}`
					: manifest.version;
				await this.update(manifest, current, updated, force, channel);
			}

			await this.config.runHook('update', { channel, version });
			ux.action.stop();
			ux.log();
			ux.log(
				`Updating to a specific version will not update the channel. If autoupdate is enabled, the CLI will eventually be updated back to ${channel}.`,
			);
		} else {
			const manifest = await this.fetchGitHubChannelManifest(channel);
			const updated = manifest.sha
				? `${manifest.version}-${manifest.sha}`
				: manifest.version;

			if (!force && this.alreadyOnVersion(current, updated)) {
				ux.action.stop(
					this.config.scopedEnvVar('HIDE_UPDATED_MESSAGE')
						? 'done'
						: `already on version ${current}`,
				);
			} else {
				await this.config.runHook('preupdate', { channel, version: updated });
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
				`Failed to fetch releases from GitHub repository ${owner}/${repo}`,
			);
		}
	}

	// GitHub-specific channel manifest fetching
	async fetchGitHubChannelManifest(channel) {
		await this.ensureOctokit();
		ux.action.status = 'fetching manifest from GitHub';

		const { owner, repo } = this.githubConfig;

		try {
			let release;

			if (channel === 'stable') {
				debug(`Fetching latest release for ${owner}/${repo}`);
				const { data } = await this.octokit.repos.getLatestRelease({
					owner,
					repo,
				});
				release = data;
			} else {
				debug(`Fetching release ${channel} for ${owner}/${repo}`);
				const { data } = await this.octokit.repos.getReleaseByTag({
					owner,
					repo,
					tag: channel,
				});
				release = data;
			}

			const version = release.tag_name.replace(/^v/u, '');
			const manifestName = this.determineManifestName();
			const manifestAsset = release.assets.find((a) => a.name === manifestName);

		if (manifestAsset) {
			// Fetch the manifest file using got (since it's a direct download URL)
			debug(`Fetching manifest from ${manifestAsset.browser_download_url}`);
			const got = await loadGot();
			const { body } = await got.get(manifestAsset.browser_download_url);
			return typeof body === 'string' ? JSON.parse(body) : body;
		}

			// If no manifest found, construct a basic one
			const assetName = this.determineAssetName(version);
			const asset = release.assets.find((a) => a.name === assetName);

			if (!asset) {
				const config = this.config;
				throw new Error(
					`No suitable asset found for ${config.platform}-${config.arch} in release ${release.tag_name}`,
				);
			}

			return {
				gz: asset.browser_download_url,
				version,
			};
		} catch (error) {
			const statusCode = error.status;
			if (statusCode === 404) {
				throw new Error(
					`Release not found for channel "${channel}" in ${owner}/${repo}`,
				);
			}

			throw error;
		}
	}

	// GitHub-specific version manifest fetching
	async fetchGitHubVersionManifest(version, url) {
		await this.ensureOctokit();
		ux.action.status = 'fetching version manifest from GitHub';

		const { owner, repo } = this.githubConfig;

		try {
			debug(`Fetching release v${version} for ${owner}/${repo}`);
			const { data: release } = await this.octokit.repos.getReleaseByTag({
				owner,
				repo,
				tag: `v${version}`,
			});

		const manifestName = this.determineManifestName();
		const manifestAsset = release.assets.find((a) => a.name === manifestName);

		if (manifestAsset) {
			debug(`Fetching manifest from ${manifestAsset.browser_download_url}`);
			const got = await loadGot();
			const { body } = await got.get(manifestAsset.browser_download_url);
			return typeof body === 'string' ? JSON.parse(body) : body;
		}

			// If no manifest found, construct a basic one
			return {
				gz: url,
				version,
			};
		} catch (error) {
			debug('Failed to fetch version manifest', error);
			// Return a basic manifest using the URL we have
			return {
				gz: url,
				version,
			};
		}
	}

	determineAssetName(version) {
		const config = this.config;
		const platform = config.platform === 'wsl' ? 'linux' : config.platform;
		const ext = config.windows ? 'tar.gz' : 'tar.gz';
		return `${config.bin}-v${version}-${platform}-${config.arch}.${ext}`;
	}

	determineManifestName() {
		const config = this.config;
		const platform = config.platform === 'wsl' ? 'linux' : config.platform;
		return `${config.bin}-${platform}-${config.arch}-buildmanifest`;
	}

	getGitHubConfig() {
		const oclifConfig = this.config;
		const config = checkGitHubConfig(oclifConfig);
		if (!config) {
			throw new Error(
				'GitHub repository not configured. Add "oclif.update.github" with "owner" and "repo" fields to package.json',
			);
		}

		return config;
	}
}

module.exports = GitHubUpdater;
