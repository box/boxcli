'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class TaskAssignmentsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(TaskAssignmentsDeleteCommand);

		await this.client.tasks.deleteAssignment(args.id);
		this.info(`Successfully deleted task assignment ${args.id}`);
	}
}

TaskAssignmentsDeleteCommand.aliases = ['task-assignments:delete'];

TaskAssignmentsDeleteCommand.description = 'Delete a task assignment';
TaskAssignmentsDeleteCommand.examples = ['box tasks:assignments:delete 12345'];
TaskAssignmentsDeleteCommand._endpoint = 'delete_task_assignments_id';

TaskAssignmentsDeleteCommand.flags = {
	...BoxCommand.flags,
};

TaskAssignmentsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task assignment to delete',
	}),
};

module.exports = TaskAssignmentsDeleteCommand;
