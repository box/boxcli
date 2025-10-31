'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class DevicePinsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(DevicePinsDeleteCommand);

		await this.client.devicePins.delete(args.id);
		this.info(`Deleted device pin ${args.id}`);
	}
}

DevicePinsDeleteCommand.description = 'Delete individual device pin';
DevicePinsDeleteCommand.examples = ['box device-pins:delete 12345'];
DevicePinsDeleteCommand._endpoint = 'delete_device_pinners_id';

DevicePinsDeleteCommand.flags = {
	...BoxCommand.flags,
};

DevicePinsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the device pin to delete',
	}),
};

module.exports = DevicePinsDeleteCommand;
