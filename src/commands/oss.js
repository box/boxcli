'use strict';

const BoxCommand = require('../box-command');
const fs = require('fs-extra');
const path = require('path');

class OSSLicensesCommand extends BoxCommand {
	async run() {

        let licensesFilePath = path.resolve(__dirname, '../../LICENSE-THIRD-PARTY.txt');

        let licenseText = await fs.readFile(licensesFilePath, 'utf8');

		await this.output(licenseText);
	}
}

OSSLicensesCommand.description = 'Print a list of open-source licensed packages used in the Box CLI';

OSSLicensesCommand.flags = {
	...BoxCommand.minFlags,
};

OSSLicensesCommand.args = [];

module.exports = OSSLicensesCommand;
