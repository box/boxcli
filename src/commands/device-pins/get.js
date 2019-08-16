'use strict';

const BoxCommand = require('../../box-command');

class DevicePinsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(DevicePinsGetCommand);

		let pin = await this.client.devicePins.get(args.id);
		await this.output(pin);
	}
}

DevicePinsGetCommand.description = 'Get information about an individual device pin';
DevicePinsGetCommand.examples = ['box device-pins:get 12345'];
DevicePinsGetCommand._endpoint = 'get_device_pinners_id';

DevicePinsGetCommand.flags = {
	...BoxCommand.flags
};

DevicePinsGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the device pin to get'
	}
];

module.exports = DevicePinsGetCommand;
