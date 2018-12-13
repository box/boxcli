'use strict';

const BoxCommand = require('../../box-command');

class GroupsListCollaborationsCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsListCollaborationsCommand);
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let collaborations = await this.client.groups.getCollaborations(args.id, options);
		await this.output(collaborations);
	}
}

GroupsListCollaborationsCommand.aliases = [
	'groups:list-collaborations',
	'collaborations:list-for-group'
];

GroupsListCollaborationsCommand.description = 'List collaborations for a group';

GroupsListCollaborationsCommand.flags = {
	...BoxCommand.flags
};

GroupsListCollaborationsCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to get collaborations for',
	}
];

module.exports = GroupsListCollaborationsCommand;
