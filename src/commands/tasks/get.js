'use strict';

const BoxCommand = require('../../box-command');

class TasksGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TasksGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let task = await this.client.tasks.get(args.id, options);
		await this.output(task);
	}
}

TasksGetCommand.description = 'Get information about a task';
TasksGetCommand.examples = [
	'box tasks:get 88888'
];
TasksGetCommand._endpoint = 'get_tasks_id';

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
