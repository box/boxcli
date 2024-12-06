'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../util');

class FoldersCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(FoldersCreateCommand);
		let params = {
			body: {
				name: args.name,
				parent: {
					id: args.parentID
				}
			}
		};

		if (flags.description) {
			params.body.description = flags.description;
		}

		// @TODO (2018-07-10): Should implement this using the Node SDK
		let createdFolder = await this.client.wrapWithDefaultHandler(this.client.post)('/folders', params);
		await this.output(createdFolder);
	}
}

FoldersCreateCommand.description = 'Create a new folder';
FoldersCreateCommand.examples = ['box folders:create 22222 "New Subfolder"'];
FoldersCreateCommand._endpoint = 'post_folders';

FoldersCreateCommand.flags = {
	...BoxCommand.flags,
	description: Flags.string({ description: 'A description for folder <DESCRIPTION>', parse: utils.unescapeSlashes }),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command'
	})
};

FoldersCreateCommand.args = {
	parentID: Args.string({
		name: 'parentID',
		required: true,
		hidden: false,
		description: 'ID of parent folder to add new folder to, use \'0\' for the root folder'
	}),
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Name of new folder'
	})
};

module.exports = FoldersCreateCommand;
