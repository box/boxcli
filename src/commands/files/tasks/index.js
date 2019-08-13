'use strict';

const BoxCommand = require('../../../box-command');

class FilesListTasksCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FilesListTasksCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let tasks = await this.client.files.getTasks(args.id, options);
		await this.output(tasks);
	}
}

FilesListTasksCommand.aliases = [ 'files:tasks:list' ];

FilesListTasksCommand.description = 'List all tasks on this file';
FilesListTasksCommand.examples = [
	'box files:tasks 11111'
];
FilesListTasksCommand._endpoint = 'get_files_id_tasks';

FilesListTasksCommand.flags = {
	...BoxCommand.flags
};

FilesListTasksCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of file on which to retrieve tasks'
	}
];

module.exports = FilesListTasksCommand;
