'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class TasksCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(TasksCreateCommand);
		let options = {};

		if (flags.message) {
			options.message = flags.message;
		}
		if (flags['due-at']) {
			options.due_at = flags['due-at'];
		}

		let task = await this.client.tasks.create(args.fileID, options);
		await this.output(task);
	}
}

TasksCreateCommand.description = 'Create a task on a file';
TasksCreateCommand.examples = [
	'box tasks:create 11111 --message "Please proofread this document"'
];
TasksCreateCommand._endpoint = 'post_tasks';

TasksCreateCommand.flags = {
	...BoxCommand.flags,
	message: flags.string({ description: 'Message for task' }),
	'due-at': flags.string({
		description: 'When this task is due, use format 05h for 5 hours for example',
		parse: input => BoxCommand.normalizeDateString(input),
	}),
	'id-only': flags.boolean({
		description: 'Return only an ID to output from this command'
	})
};

TasksCreateCommand.args = [
	{
		name: 'fileID',
		required: true,
		hidden: false,
		description: 'ID of the file to create a task on',
	}
];

module.exports = TasksCreateCommand;
