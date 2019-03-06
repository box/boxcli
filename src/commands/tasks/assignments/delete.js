'use strict';

const BoxCommand = require('../../../box-command');

class TaskAssignmentsDeleteCommand extends BoxCommand {
	async run() {
		const { flags } = this.parse(TaskAssignmentsDeleteCommand);
		const { args } = this.parse(TaskAssignmentsDeleteCommand);

		await this.client.tasks.deleteAssignment(args.id);
		this.info(`Successfully deleted task assignment ${args.id}`);
	}
}

TaskAssignmentsDeleteCommand.aliases = [ 'task-assignments:delete' ];

TaskAssignmentsDeleteCommand.description = 'Delete a task assignment';

TaskAssignmentsDeleteCommand.flags = {
	...BoxCommand.flags
};

TaskAssignmentsDeleteCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task assignment to delete',
	}
];

module.exports = TaskAssignmentsDeleteCommand;
