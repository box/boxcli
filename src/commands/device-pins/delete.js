'use strict';

const BoxCommand = require('../../box-command');

class DevicePinsDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(DevicePinsDeleteCommand);

		await this.client.devicePins.delete(args.id);
		this.info(`Deleted device pin ${args.id}`);
	}
}

DevicePinsDeleteCommand.description = 'Delete individual device pin';

DevicePinsDeleteCommand.flags = {
	...BoxCommand.flags
};

DevicePinsDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the device pin to delete'
	}
];

module.exports = DevicePinsDeleteCommand;
