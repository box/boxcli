'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const fs = require('fs-extra');
const BoxCLIError = require('../../cli-error');
const utils = require('../../util');

/* eslint-disable no-sync */

class ConfigureSettingsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(ConfigureSettingsCommand);
		let settings = this.settings;

		if (flags['downloads-folder-path']) {
			let downloadsPath = flags['downloads-folder-path'];
			if (!fs.existsSync(downloadsPath)) {
				let shouldCreate = await this.confirm(`Folder ${downloadsPath} does not exist; create it?`);

				if (!shouldCreate) {
					throw new BoxCLIError('Could not update settings due to incorrect folder path');
				}

				try {
					await fs.mkdirp(downloadsPath);
				} catch (ex) {
					throw new BoxCLIError('Could not create downloads directory', ex);
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
				let shouldCreate = await this.confirm(`Folder ${reportsPath} does not exist; create it?`);

				if (!shouldCreate) {
					throw new BoxCLIError('Could not update settings due to incorrect folder path');
				}

				try {
					await fs.mkdirp(reportsPath);
				} catch (ex) {
					throw new BoxCLIError('Could not create downloads directory', ex);
				}
			} else if (!fs.statSync(reportsPath).isDirectory()) {
				throw new BoxCLIError(`${reportsPath} is not a directory!`);
			}
			settings.boxReportsFolderPath = reportsPath;
		}
		if (flags.hasOwnProperty('output-json')) {
			settings.outputJson = flags['output-json'];
		}

		this.updateSettings(settings);
		await this.output(settings);
	}
}

// @NOTE: This command does not require a client to be set up
ConfigureSettingsCommand.noClient = true;

ConfigureSettingsCommand.description = 'View and update CLI configuration settings';

ConfigureSettingsCommand.flags = {
	...BoxCommand.minFlags,
	'downloads-folder-path': flags.string({
		description: 'Set folder path for the downloads folder',
		parse: utils.parsePath,
	}),
	'file-format': flags.string({
		description: 'Set the file format for generated reports',
		options: [
			'csv',
			'json',
			'txt'
		]
	}),
	'output-json': flags.boolean({
		description: 'Default to JSON output for all commands',
		allowNo: true,
	}),
	'reports-folder-path': flags.string({
		description: 'Set folder path for the reports folder',
		parse: utils.parsePath,
	})
};

module.exports = ConfigureSettingsCommand;
