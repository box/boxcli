'use strict';
const { sort } = require('semver');
const path = require('node:path');
const GitHubUpdater = require('../github-updater');
const UpdateCommand =
	require('@oclif/plugin-update/lib/commands/update').default;

class GithubUpdatecommand extends UpdateCommand {
	async run() {
		const { flags } = await this.parse(GithubUpdatecommand);
		const updater = new GitHubUpdater(this.config);
		if (flags.available) {
			// @oclif/table is pinned to 0.5.4: later versions depend on string-width@8,
			// which requires Node 20 and fails to load on Node 18.
			const { printTable } = await import('@oclif/table');
			const index = await updater.fetchVersionIndex();
			const allVersions = sort(Object.keys(index)).reverse();
			const localVersions = await updater.findLocalVersions();

			const table = allVersions.map((version) => {
				const location =
					localVersions.find((l) =>
						path.basename(l).startsWith(version)
					) || index[version];
				return { version, location };
			});

			printTable({
				columns: [{ key: 'version' }, { key: 'location' }],
				data: table,
			});
			return;
		}

		await updater.runUpdate({
			autoUpdate: flags.autoupdate,
			force: flags.force,
			version: flags.interactive
				? await this.promptForVersion(updater)
				: flags.version,
		});
	}
}

GithubUpdatecommand.args = [];
GithubUpdatecommand.examples = GithubUpdatecommand.examples.slice(1);
GithubUpdatecommand.description = 'Update the BoxCLI using GitHub';

module.exports = GithubUpdatecommand;
