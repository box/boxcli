'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');
const PaginationUtilities = require('../../pagination-utils');

class GroupsListCollaborationsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			GroupsListCollaborationsCommand
		);
		let options = PaginationUtilities.handlePagination(flags);

		if (flags.fields) {
			options.fields = flags.fields;
		}

		let collaborations = await this.client.groups.getCollaborations(
			args.id,
			options
		);
		await this.output(collaborations);
	}
}

GroupsListCollaborationsCommand.aliases = [
	'groups:list-collaborations',
	'collaborations:list-for-group',
];

GroupsListCollaborationsCommand.description = 'List collaborations for a group';
GroupsListCollaborationsCommand.examples = ['box groups:collaborations 12345'];
GroupsListCollaborationsCommand._endpoint = 'get_groups_id_collaborations';

GroupsListCollaborationsCommand.flags = {
	...BoxCommand.flags,
	...PaginationUtilities.flag,
};

GroupsListCollaborationsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to get collaborations for',
	}),
};

module.exports = GroupsListCollaborationsCommand;
