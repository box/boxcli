'use strict'

const BoxCommand = require('../../box-command');
const {Flags} = require('@oclif/core');
const utils = require('../../util');

class AiExtractStructuredCommand extends BoxCommand {
	async run() {
		const {flags} = await this.parse(AiExtractStructuredCommand);
		let options = {};

		if (flags.items) {
			options.items = flags.items;
		}

		if (flags.fields) {
			options.fields = JSON.parse(flags.fields);
			delete this.flags.fields;
		}

		let answer = await this.tsClient.ai.createAiExtractStructured(options);
		delete answer.rawData.ai_agent_info;
		await this.output(answer.rawData);
	}
}

AiExtractStructuredCommand.description = 'Extract structured metadata from a file using Box AI';
AiExtractStructuredCommand.examples = [
	'box ai:extract-structured --items=id=12345,type=file --fields \'[{"key":"firstName","type":"string","description":"Person first name","prompt":"What is the first name?","displayName":"First name"}]\'',
];
AiExtractStructuredCommand._endpoint = 'post_ai_extract_structured';

AiExtractStructuredCommand.flags = {
	...BoxCommand.flags,
	items: Flags.string({
		required: true,
		description: 'The items for the AI request (id, type, optional content)',
		multiple: true,
		parse(input) {
			const item = {
				id: '',
				type: 'file',
			};
			const obj = utils.parseStringToObject(input, ['id', 'type', 'content']);
			for (const key in obj) {
				if (key === 'id') {
					item.id = obj[key];
				} else if (key === 'type') {
					item.type = obj[key];
				} else if (key === 'content') {
					item.content = obj[key];
				} else {
					throw new Error(`Invalid item key ${key}`);
				}
			}
			if (!item.id) {
				throw new Error('Item must include an id');
			}
			return item;
		},
	}),
	fields: Flags.string({
		required: true,
		description:
			'JSON string of fields to extract (e.g., [{"key":"firstName","type":"string","description":"Person first name","prompt":"What is the first name?","displayName":"First name"}])',
	}),
}

module.exports = AiExtractStructuredCommand;
