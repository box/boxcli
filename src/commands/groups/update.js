'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../util');

class GroupsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(GroupsUpdateCommand);
		let updates = {};

		if (flags.name) {
			updates.name = flags.name;
		}
		if (flags.description) {
			updates.description = flags.description;
		}
		if (flags['external-sync-identifier']) {
			updates.external_sync_identifier = flags['external-sync-identifier'];
		}
		if (flags.provenance) {
			updates.provenance = flags.provenance;
		}
		if (flags.invite) {
			updates.invitability_level = flags.invite;
		}
		if (flags['view-members']) {
			updates.member_viewability_level = flags['view-members'];
		}

		let group = await this.client.groups.update(args.id, updates);
		await this.output(group);
	}
}

GroupsUpdateCommand.description = 'Update a group';
GroupsUpdateCommand.examples = ['box groups:update 12345 --name "U.S. Employees"'];
GroupsUpdateCommand._endpoint = 'put_groups_id';

GroupsUpdateCommand.flags = {
	...BoxCommand.flags,
	name: flags.string({
		char: 'n',
		description: 'The name of the group',
	}),
	description: flags.string({ description: 'Description of the group', parse: utils.unescapeSlashes }),
	'external-sync-identifier': flags.string({ description: 'group identifier for groups coming from an external source' }),
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
	})
};

GroupsUpdateCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the group to update',
	}
];

module.exports = GroupsUpdateCommand;
