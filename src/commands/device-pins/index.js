'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class DevicePinsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(DevicePinsListCommand);
		let options = {};

		if (flags.direction) {
			options.direction = flags.direction;
		}

		let pins = await this.client.devicePins.getAll(options);
		await this.output(pins);
	}
}

DevicePinsListCommand.description = 'List all the device pins for your enterprise';

DevicePinsListCommand.flags = {
	...BoxCommand.flags,
	direction: flags.string({
		description: 'Set sorting (by id) direction. Default is ASC',
		options: [
			'ASC',
			'DESC'
		]
	})
};

module.exports = DevicePinsListCommand;
