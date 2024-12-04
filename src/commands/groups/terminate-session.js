'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');

class GroupsTerminateSessionCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(GroupsTerminateSessionCommand);

        let response = await this.client.groups.terminateSession(flags['group-ids']);
        await this.output(response);
	}
}

GroupsTerminateSessionCommand.aliases = [ 'groups:terminate-session' ];

GroupsTerminateSessionCommand.description = 'Validates the roles and permissions of the group, and creates asynchronous jobs to terminate the group\'s sessions.';
GroupsTerminateSessionCommand.examples = ['box groups:terminate-session --group-ids 123 345'];
GroupsTerminateSessionCommand._endpoint = 'post_groups_terminate_sessions';

GroupsTerminateSessionCommand.flags = {
    ...BoxCommand.flags,
    'group-ids': Flags.string({
        description: 'A list of group IDs',
        multiple: true,
        required: true
    }),
};

GroupsTerminateSessionCommand.args = {};

module.exports = GroupsTerminateSessionCommand;
