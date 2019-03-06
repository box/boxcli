'use strict';

const BoxCommand = require('../../../box-command');

class TaskAssignmentsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TaskAssignmentsGetCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let assignment = await this.client.tasks.getAssignment(args.id, options);
		await this.output(assignment);
	}
}

TaskAssignmentsGetCommand.aliases = [ 'task-assignments:get' ];

TaskAssignmentsGetCommand.description = 'Get information about a task assignment';

TaskAssignmentsGetCommand.flags = {
	...BoxCommand.flags
};

TaskAssignmentsGetCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task assignment to get',
	}
];

module.exports = TaskAssignmentsGetCommand;
