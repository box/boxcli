'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleSystemsIssueRegistrationTokenCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(
			ShuttleSystemsIssueRegistrationTokenCommand
		);
		const credentials =
			await this.tsClient.shuttle.createShuttleSystemIssueRegistrationTokenV2026R0(args.id);
		await this.output(credentials.rawData ?? credentials);
	}
}

ShuttleSystemsIssueRegistrationTokenCommand.description =
	'Issue a registration token for a Windows shuttle agent system';
ShuttleSystemsIssueRegistrationTokenCommand.examples = [
	'box shuttle:systems:issue-registration-token 6a315c0754833bfc5df067bf',
];
ShuttleSystemsIssueRegistrationTokenCommand._endpoint =
	'post_shuttle_systems_id_issue_registration_token';

ShuttleSystemsIssueRegistrationTokenCommand.flags = {
	...BoxCommand.flags,
};

ShuttleSystemsIssueRegistrationTokenCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle system',
	}),
};

module.exports = ShuttleSystemsIssueRegistrationTokenCommand;
