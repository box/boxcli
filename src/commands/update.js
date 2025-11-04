'use strict';
const { sort } = require('semver');
const path = require('node:path');
const GitHubUpdater = require('../github-updater');
const UpdateCommand =
	require('@oclif/plugin-update/lib/commands/update').default;

class GithubUpdatecommand extends UpdateCommand {
	async run() {
		const { printTable } = await import('@oclif/table');
		const { args, flags } = await this.parse(UpdateCommand);
		const updater = new GitHubUpdater(this.config);
		if (flags.available) {
			const index = await updater.fetchVersionIndex();
			const allVersions = sort(Object.keys(index)).reverse();
			const localVersions = await updater.findLocalVersions();

			const table = allVersions.map((version) => {
				const location =
					localVersions.find((l) => path.basename(l).startsWith(version)) ||
					index[version];
				return { version, location };
			});

			printTable({
				columns: [
					{ key: 'version' },
					{ key: 'location' },
				],
				data: table,
			});
			return;
		}

		if (args.channel && flags.version) {
			this.error('You cannot specify both a version and a channel.');
		}

		updater.runUpdate({
			channel: args.channel,
			autoUpdate: flags.autoupdate,
			force: flags.force,
			version: flags.interactive
				? await this.promptForVersion(updater)
				: flags.version,
		});
	}
}

module.exports = GithubUpdatecommand;
