'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class TaskAssignmentsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TaskAssignmentsCreateCommand);
		let assignment;

		if (flags['assign-to-user-id']) {
			assignment = await this.client.tasks.assignByUserID(args.taskID, flags['assign-to-user-id']);
		} else if (flags['assign-to-user-login']) {
			assignment = await this.client.tasks.assignByEmail(args.taskID, flags['assign-to-user-login']);
		}
		await this.output(assignment);
	}
}

TaskAssignmentsCreateCommand.aliases = [ 'task-assignments:create' ];

TaskAssignmentsCreateCommand.description = 'Create a task assignment';
TaskAssignmentsCreateCommand.examples = ['box tasks:assign 88888 --assign-to-user-id 33333'];
TaskAssignmentsCreateCommand._endpoint = 'post_task_assignments';

TaskAssignmentsCreateCommand.flags = {
	...BoxCommand.flags,
	'assign-to-user-id': flags.string({
		description: 'Assign task by user ID',
		exclusive: ['assign-to-user-login']
	}),
	'assign-to-user-login': flags.string({
		description: 'Assign task by user login',
		exclusive: ['assign-to-user-id']
	})
};

TaskAssignmentsCreateCommand.args = [
	{
		name: 'taskID',
		required: true,
		hidden: false,
		description: 'ID of the task to assign',
	}
];

module.exports = TaskAssignmentsCreateCommand;
