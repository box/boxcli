'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class TasksUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TasksUpdateCommand);
		let options = {};

		if (flags.message) {
			options.message = flags.message;
		}
		if (flags['due-at']) {
			options.due_at = flags['due-at'];
		}
		if (flags['completion-rule']) {
			options.completion_rule = flags['completion-rule'];
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
	message: Flags.string({ description: 'Message for task' }),
	'due-at': Flags.string({
		description:
			'When this task is due, use format 05h for 5 hours for example',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'completion-rule': Flags.string({
		description:
			'Rule for how many assignees must complete the task to consider it completed',
		options: ['all_assignees', 'any_assignee'],
	}),
};

TasksUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the task to update',
	}),
};

module.exports = TasksUpdateCommand;
