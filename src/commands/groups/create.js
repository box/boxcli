'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utils = require('../../util');

class GroupsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(GroupsCreateCommand);
		let options = {};

		if (flags.description) {
			options.description = flags.description;
		}
		if (flags['external-sync-identifier']) {
			options.external_sync_identifier =
				flags['external-sync-identifier'];
		}
		if (flags.provenance) {
			options.provenance = flags.provenance;
		}
		if (flags.invite) {
			options.invitability_level = flags.invite;
		}
		if (flags['view-members']) {
			options.member_viewability_level = flags['view-members'];
		}

		let group = await this.client.groups.create(args.name, options);
		await this.output(group);
	}
}

GroupsCreateCommand.description = 'Create a group';
GroupsCreateCommand.examples = ['box groups:create "US Employees"'];
GroupsCreateCommand._endpoint = 'post_groups';

GroupsCreateCommand.flags = {
	...BoxCommand.flags,
	description: Flags.string({
		description: 'Description of the group',
		parse: utils.unescapeSlashes,
	}),
	'external-sync-identifier': Flags.string({
		description:
			'Group identifier for groups coming from an external source',
	}),
	provenance: Flags.string({
		description: 'Track the external source where the group is coming from',
	}),
	invite: Flags.string({
		char: 'i',
		description: 'Specifies who can invite the group to collaborate',
		options: ['admins_only', 'admins_and_members', 'all_managed_users'],
	}),
	'view-members': Flags.string({
		char: 'm',
		description: 'Specifies who can view the members of the group',
		options: ['admins_only', 'admins_and_members', 'all_managed_users'],
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
};

GroupsCreateCommand.args = {
	name: Args.string({
		name: 'name',
		required: true,
		hidden: false,
		description: 'Group name',
	}),
};

module.exports = GroupsCreateCommand;
