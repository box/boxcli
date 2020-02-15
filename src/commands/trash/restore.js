'use strict';

const BoxCommand = require('../../box-command');

class TrashRestoreCommand extends BoxCommand {
	async run() {
        const { flags, args } = this.parse(TrashRestoreCommand);
        let options = {};

		if (flags.name) {
			options.name = flags.name;
        }
        if (flags['parent-id']) {
			options.parent = {
                id: flags['parent-id']
            }; 
		}
        let item;
		if (args.type === 'file') {
			item = await this.client.files.restoreFromTrash(args.id, options);
		} else if (args.type === 'folder') {
			item = await this.client.folders.restoreFromTrash(args.id, options);
		} else if (args.type === 'web_link') {
			item = await this.client.wrapWithDefaultHandler(this.client.post)(`/web_links/${args.id}`, {body: options});
		}
		await this.output(item);
	}
}

TrashRestoreCommand.description = 'Restore an item from trash';
TrashRestoreCommand.examples = ['box trash:restore folder 22222'];

TrashRestoreCommand.flags = {
    ...BoxCommand.flags,
    'name': flags.string({
		description: 'An new name for the item'
	}),
	'parent-id': flags.string({
		description: 'ID of a folder to restore the item to only when the original folder no longer exists'
	})
};

TrashRestoreCommand.args = [
	{
		name: 'type',
		required: true,
		hidden: false,
		description: 'Type of the item to restore',
		options: [
			'file',
			'folder',
			'web_link'
		],
	},
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the item to restore',
    }
];

module.exports = TrashRestoreCommand;
