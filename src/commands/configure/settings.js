'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const fs = require('fs');
const { mkdirp } = require('mkdirp');
const BoxCLIError = require('../../cli-error');
const utils = require('../../util');

/* eslint-disable no-sync */

class ConfigureSettingsCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ConfigureSettingsCommand);
		let settings = this.settings;

		if (flags['downloads-folder-path']) {
			let downloadsPath = flags['downloads-folder-path'];
			if (!fs.existsSync(downloadsPath)) {
				let shouldCreate = await this.confirm(
					`Folder ${downloadsPath} does not exist; create it?`
				);

				if (!shouldCreate) {
					throw new BoxCLIError(
						'Could not update settings due to incorrect folder path'
					);
				}

				try {
					await mkdirp(downloadsPath);
				} catch (ex) {
					throw new BoxCLIError(
						'Could not create downloads directory',
						ex
					);
				}
			} else if (!fs.statSync(downloadsPath).isDirectory()) {
				throw new BoxCLIError(`${downloadsPath} is not a directory!`);
			}

			settings.boxDownloadsFolderPath = downloadsPath;
		}
		if (flags['file-format']) {
			settings.boxReportsFileFormat = flags['file-format'];
		}
		if (flags['reports-folder-path']) {
			let reportsPath = flags['reports-folder-path'];
			if (!fs.existsSync(reportsPath)) {
				let shouldCreate = await this.confirm(
					`Folder ${reportsPath} does not exist; create it?`
				);

				if (!shouldCreate) {
					throw new BoxCLIError(
						'Could not update settings due to incorrect folder path'
					);
				}

				try {
					await mkdirp(reportsPath);
				} catch (ex) {
					throw new BoxCLIError(
						'Could not create downloads directory',
						ex
					);
				}
			} else if (!fs.statSync(reportsPath).isDirectory()) {
				throw new BoxCLIError(`${reportsPath} is not a directory!`);
			}
			settings.boxReportsFolderPath = reportsPath;
		}
		if (flags.hasOwnProperty('output-json')) {
			settings.outputJson = flags['output-json'];
		}
		if (flags.hasOwnProperty('enable-proxy')) {
			settings.enableProxy = flags['enable-proxy'];
		}
		if (flags['proxy-url']) {
			settings.proxy.url = flags['proxy-url'];
		}
		if (flags['proxy-username']) {
			settings.proxy.username = flags['proxy-username'];
		}
		if (flags['proxy-password']) {
			settings.proxy.password = flags['proxy-password'];
		}
		if (flags.hasOwnProperty(['enable-analytics-client'])) {
			settings.enableAnalyticsClient = flags['enable-analytics-client'];
		}
		if (flags['analytics-client-name']) {
			settings.analyticsClient.name = flags['analytics-client-name'];
		}

		this.updateSettings(settings);
		await this.output(settings);
	}
}

// @NOTE: This command does not require a client to be set up
ConfigureSettingsCommand.noClient = true;

ConfigureSettingsCommand.description =
	'View and update CLI configuration settings';

ConfigureSettingsCommand.flags = {
	...BoxCommand.minFlags,
	json: Flags.boolean({
		description: 'Output CLI configuration settings in JSON format',
	}),
	'enable-proxy': Flags.boolean({
		description: 'Enable or disable proxy',
		allowNo: true,
	}),
	'proxy-url': Flags.string({
		description:
			'Set proxy url, which should contain the protocol, url, and port (i.e. http://sample.proxyurl.com:80)',
	}),
	'proxy-username': Flags.string({
		description: 'Set username for proxy',
		dependsOn: ['proxy-password'],
	}),
	'proxy-password': Flags.string({
		description: 'Set password for proxy',
		dependsOn: ['proxy-username'],
	}),
	'downloads-folder-path': Flags.string({
		description: 'Set folder path for the downloads folder',
		parse: utils.parsePath,
	}),
	'file-format': Flags.string({
		description: 'Set the file format for generated reports',
		options: ['csv', 'json', 'txt'],
	}),
	'output-json': Flags.boolean({
		description: 'Default to JSON output for all commands',
		allowNo: true,
	}),
	'reports-folder-path': Flags.string({
		description: 'Set folder path for the reports folder',
		parse: utils.parsePath,
	}),
	'enable-analytics-client': Flags.boolean({
		description: 'Enable or disable custom analytics client',
		allowNo: true,
	}),
	'analytics-client-name': Flags.string({
		description: 'Set custom analytics client header value',
	}),
};

module.exports = ConfigureSettingsCommand;
