'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class TasksUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TasksUpdateCommand);
		let options = {};

		if (flags.message) {
			options.message = flags.message;
		}
		if (flags['due-at']) {
			options.due_at = flags['due-at'];
		}

		let task = await this.client.tasks.update(args.id, options);
		await this.output(task);
	}
}

TasksUpdateCommand.description = 'Update a task on a file';
TasksUpdateCommand.examples = ['box tasks:update 88888 --due-at 1w'];
TasksUpdateCommand._endpoint = 'put_tasks_id';

TasksUpdateCommand.flags = {
	...BoxCommand.flags,
	message: flags.string({ description: 'Message for task' }),
	'due-at': flags.string({
		description: 'When this task is due, use format 05h for 5 hours for example',
		parse: input => BoxCommand.normalizeDateString(input),
	}),
};

TasksUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task to update',
	}
];

module.exports = TasksUpdateCommand;
