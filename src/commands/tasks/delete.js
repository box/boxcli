'use strict';

const BoxCommand = require('../../box-command');

class TasksDeleteCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TasksDeleteCommand);

		await this.client.tasks.delete(args.id);
		this.info(`Successfully deleted task ${args.id}`);
	}
}

TasksDeleteCommand.description = 'Delete a task';
TasksDeleteCommand.examples = [
	'box tasks:delete 88888'
];
TasksDeleteCommand._endpoint = 'delete_tasks_id';

TasksDeleteCommand.flags = {
	...BoxCommand.flags
};

TasksDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task to delete',
	}
];

module.exports = TasksDeleteCommand;
