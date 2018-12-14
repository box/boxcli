'use strict';

const BoxCommand = require('../../../box-command');

class TaskAssignmentsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TaskAssignmentsListCommand);

		let assignments = await this.client.tasks.getAssignments(args.id);
		await this.output(assignments);
	}
}

TaskAssignmentsListCommand.aliases = [ 'task-assignments:list' ];

TaskAssignmentsListCommand.description = 'List all task assignments on a task';

TaskAssignmentsListCommand.flags = {
	...BoxCommand.flags
};

TaskAssignmentsListCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task to get assignments for',
	}
];

module.exports = TaskAssignmentsListCommand;
