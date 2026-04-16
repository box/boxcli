'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const utilities = require('../../../util');

const HUB_ITEM_TYPES = ['file', 'folder', 'web_link'];
const HUB_ITEM_OPERATION_KEYS = ['id', 'type', 'parent-id'];

function parseHubItemOperation(action, input) {
	const parsed = utilities.parseStringToObject(input, HUB_ITEM_OPERATION_KEYS);
	const operation = {
		action,
		item: {},
	};

	if (!parsed.id) {
		throw new Error('Hub item operations require an id key.');
	}

	if (!parsed.type) {
		throw new Error('Hub item operations require a type key.');
	}

	if (!HUB_ITEM_TYPES.includes(parsed.type)) {
		throw new Error(
			`Invalid hub item type '${parsed.type}'. Supported types are ${HUB_ITEM_TYPES.join(', ')}.`
		);
	}

	operation.item.id = parsed.id;
	operation.item.type = parsed.type;

	if (parsed['parent-id']) {
		operation.parentId = parsed['parent-id'];
	}

	return operation;
}

class HubsManageItemsCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(HubsManageItemsCommand);
		const operations = [...(flags.add || []), ...(flags.remove || [])];

		if (operations.length === 0) {
		throw new Error('Please provide at least one --add or --remove flag.');
		}

		const response = await this.tsClient.hubItems.manageHubItemsV2025R0(
			args.id,
			{ operations }
		);
		delete response.rawData;
		await this.output(response);
	}
}

HubsManageItemsCommand.description = 'Add or remove items in a Box Hub';
HubsManageItemsCommand.examples = [
	'box hubs:items:manage 12345 --add id=11111,type=file,parent-id=67890',
	'box hubs:items:manage 12345 --remove id=22222,type=folder',
];
HubsManageItemsCommand._endpoint = 'post_hubs_id_manage_items';

HubsManageItemsCommand.flags = {
	...BoxCommand.flags,
	add: Flags.string({
		description:
			'Add an item to the Box Hub. Format: id=ITEM_ID,type=TYPE,parent-id=PARENT_ID. Supported types are file, folder, web_link. The parent-id is the ID of the parent block to add the item to. It must be an Item List block. If not provided, the item will be added to the first page\'s first Item List block.',
		multiple: true,
		parse(input) {
			return parseHubItemOperation('add', input);
		},
	}),
	remove: Flags.string({
		description:
			'Remove an item from the Box Hub. Format: id=ITEM_ID,type=TYPE. Supported types are file, folder, web_link.',
		multiple: true,
		parse(input) {
			return parseHubItemOperation('remove', input);
		},
	}),
};

HubsManageItemsCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsManageItemsCommand;
