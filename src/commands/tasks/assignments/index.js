'use strict';

const BoxCommand = require('../../../box-command');

class TaskAssignmentsListCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TaskAssignmentsListCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let assignments = await this.client.tasks.getAssignments(args.id, options);
		await this.output(assignments);
	}
}

TaskAssignmentsListCommand.aliases = [ 'task-assignments:list' ];

TaskAssignmentsListCommand.description = 'List all task assignments on a task';
TaskAssignmentsListCommand.examples = ['box tasks:assignments 88888'];
TaskAssignmentsListCommand._endpoint = 'get_tasks_id_assignments';

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
