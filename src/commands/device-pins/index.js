'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const PaginationUtils = require('../../pagination-utils');

class DevicePinsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(DevicePinsListCommand);
		let options = PaginationUtils.handlePagination(flags);

		if (flags.direction) {
			options.direction = flags.direction;
		}

		let pins = await this.client.devicePins.getAll(options);
		await this.output(pins);
	}
}

DevicePinsListCommand.description = 'List all the device pins for your enterprise';
DevicePinsListCommand.examples = ['box device-pins'];
DevicePinsListCommand._endpoint = 'get_enterprises_id_device_pinners';

DevicePinsListCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtils.flags,
	direction: Flags.string({
		description: 'Set sorting (by id) direction. Default is ASC',
		options: [
			'ASC',
			'DESC'
		]
	})
};

module.exports = DevicePinsListCommand;
