'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class GroupsCreateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsCreateCommand);
		let options = {};

		if (flags.description) {
			options.description = flags.description;
		}
		if (flags['external-sync-identifier']) {
			options.external_sync_identifier = flags['external-sync-identifier'];
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

GroupsCreateCommand.flags = {
	...BoxCommand.flags,
	description: flags.string({ description: 'Description of the group' }),
	'external-sync-identifier': flags.string({
		description: 'Group identifier for groups coming from an external source',
	}),
	provenance: flags.string({ description: 'Track the external source where the group is coming from' }),
	invite: flags.string({
		char: 'i',
		description: 'Specifies who can invite the group to collaborate',
		options: [
			'admins_only',
			'admins_and_members',
			'all_managed_users'
		]
	}),
	'view-members': flags.string({
		char: 'm',
		description: 'Specifies who can view the members of the group',
		options: [
			'admins_only',
			'admins_and_members',
			'all_managed_users'
		]
	}),
	'id-only': flags.boolean({
		description: 'Return only an ID to output from this command'
	})
};

GroupsCreateCommand.args = [
	{
		name: 'name',
		required: true,
		hidden: false,
		description: 'Group name'
	}
];

module.exports = GroupsCreateCommand;
