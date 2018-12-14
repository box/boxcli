'use strict';

const BoxCommand = require('../../box-command');

class TasksGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TasksGetCommand);

		let task = await this.client.tasks.get(args.id);
		await this.output(task);
	}
}

TasksGetCommand.description = 'Get information about a task';

TasksGetCommand.flags = {
	...BoxCommand.flags
};

TasksGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task to get',
	}
];

module.exports = TasksGetCommand;
