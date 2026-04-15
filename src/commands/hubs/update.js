'use strict';

const BoxCommand = require('../../box-command');
const { Flags, Args } = require('@oclif/core');
const utilities = require('../../util');

class HubsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsUpdateCommand);
		const requestBody = {};

		if (flags.title) {
			requestBody.title = flags.title;
		}
		if (flags.description) {
			requestBody.description = flags.description;
		}
		if (Object.hasOwn(flags, 'ai-enabled')) {
			requestBody.isAiEnabled = flags['ai-enabled'];
		}
		if (Object.hasOwn(flags, 'collaboration-restricted-to-enterprise')) {
			requestBody.isCollaborationRestrictedToEnterprise =
				flags['collaboration-restricted-to-enterprise'];
		}
		if (Object.hasOwn(flags, 'can-non-owners-invite')) {
			requestBody.canNonOwnersInvite = flags['can-non-owners-invite'];
		}
		if (Object.hasOwn(flags, 'can-shared-link-be-created')) {
			requestBody.canSharedLinkBeCreated =
				flags['can-shared-link-be-created'];
		}
		if (Object.hasOwn(flags, 'can-public-shared-link-be-created')) {
			requestBody.canPublicSharedLinkBeCreated =
				flags['can-public-shared-link-be-created'];
		}

		if (Object.keys(requestBody).length === 0) {
			this.error('Please provide at least one update flag.');
		}

		const hub = await this.tsClient.hubs.updateHubByIdV2025R0(
			args.id,
			requestBody
		);
		delete hub.rawData;
		await this.output(hub);
	}
}

HubsUpdateCommand.description = 'Update a Box Hub';
HubsUpdateCommand.examples = [
	'box hubs:update 12345 --title "Updated title" --ai-enabled',
];
HubsUpdateCommand._endpoint = 'put_hubs_id';

HubsUpdateCommand.flags = {
	...BoxCommand.flags,
	title: Flags.string({
		char: 'T',
		description: 'Updated title for the Box Hub',
	}),
	description: Flags.string({
		char: 'd',
		description: 'Updated description for the Box Hub',
		parse: utilities.unescapeSlashes,
	}),
	'ai-enabled': Flags.boolean({
		description: 'Enable or disable AI features for this Box Hub',
		allowNo: true,
	}),
	'collaboration-restricted-to-enterprise': Flags.boolean({
		description: 'Restrict collaboration to enterprise users only',
		allowNo: true,
	}),
	'can-non-owners-invite': Flags.boolean({
		description: 'Allow non-owners to invite collaborators',
		allowNo: true,
	}),
	'can-shared-link-be-created': Flags.boolean({
		description: 'Allow shared links for this Box Hub',
		allowNo: true,
	}),
	'can-public-shared-link-be-created': Flags.boolean({
		description: 'Allow public shared links for this Box Hub',
		allowNo: true,
	}),
};

HubsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub to update',
	}),
};

module.exports = HubsUpdateCommand;
