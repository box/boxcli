'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class TaskAssignmentsGetCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TaskAssignmentsGetCommand);
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
TaskAssignmentsGetCommand.examples = ['box tasks:assignments:get 12345'];
TaskAssignmentsGetCommand._endpoint = 'get_task_assignments_id';

TaskAssignmentsGetCommand.flags = {
	...BoxCommand.flags
};

TaskAssignmentsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task assignment to get',
	}),
};

module.exports = TaskAssignmentsGetCommand;
