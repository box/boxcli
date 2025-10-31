'use strict';

const BoxCommand = require('../box-command');
const path = require('node:path');
const utilities = require('../util');

class OSSLicensesCommand extends BoxCommand {
	async run() {
		let licensesFilePath = path.resolve(
			__dirname,
			'../../LICENSE-THIRD-PARTY.txt'
		);

		let licenseText = await utilities.readFileAsync(
			licensesFilePath,
			'utf8'
		);

		await this.output(licenseText);
	}
}

OSSLicensesCommand.description =
	'Print a list of open-source licensed packages used in the Box CLI';

OSSLicensesCommand.flags = {
	...BoxCommand.minFlags,
};

module.exports = OSSLicensesCommand;
