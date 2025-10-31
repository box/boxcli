'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class TasksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(TasksCreateCommand);
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

		let task = await this.client.tasks.create(args.fileID, options);
		await this.output(task);
	}
}

TasksCreateCommand.description = 'Create a task on a file';
TasksCreateCommand.examples = [
	'box tasks:create 11111 --message "Please proofread this document"',
];
TasksCreateCommand._endpoint = 'post_tasks';

TasksCreateCommand.flags = {
	...BoxCommand.flags,
	message: Flags.string({ description: 'Message for task' }),
	'due-at': Flags.string({
		description:
			'When this task is due, use format 05h for 5 hours for example',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
	'completion-rule': Flags.string({
		description:
			'Rule for how many assignees must complete the task to consider it completed',
		options: ['all_assignees', 'any_assignee'],
	}),
};

TasksCreateCommand.args = {
	fileID: Args.string({
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to create a task on',
	}),
};

module.exports = TasksCreateCommand;
